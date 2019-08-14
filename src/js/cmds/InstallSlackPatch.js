const fs = require('fs').promises;
const { join, resolve } = require('path');
const asar = require('asar');
const https = require('https');


const fileExists = async function (file) {
    try {
        let stat = await fs.stat(file);
        return stat.isFile();
    } catch (e) {
        return false;
    }
};

const downloadFile = function (url) {
    return new Promise(function(resolve, reject) {
        https.get(url, (res) => {
            if (res.statusCode != 200) {
                reject(res.statusCode);
                return;
            }
            let data = '';
            res.on('data', (d) => {
                data += d;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
};

const removeDir = async (dir) => {
    try {
        const files = await fs.readdir(dir);
        await Promise.all(files.map(async (file) => {
            try {
                const p = join(dir, file);
                const stat = await fs.lstat(p);
                if (stat.isDirectory()) {
                    await removeDir(p);
                } else {
                    await fs.unlink(p);
                }
            } catch (err) {
                console.error(err);
            }
        }));
        await fs.rmdir(dir);
    } catch (err) {
        console.error(err);
    }
};

module.exports = async (args) => {
    // Find correct Slack folder
    let slackPath = require('./FindLatestSlackVersion')(args);
    slackPath = join(slackPath, 'resources');

    let slackAsar = join(slackPath, 'app.asar');
    let slackAsarBak = join(slackPath, 'app.asar.bak');
    let slackAsarUnpacked = join(slackPath, 'appTEST.asar.unpacked');
    let slackFile = join(slackAsarUnpacked, 'dist', 'ssb-interop.bundle.js');

    // Ensure we have the asar
    if(!(await fileExists(slackAsar))) {
        console.error('Unable to locate Slack\'s asar to patch');
        process.exit(-1);
    }

    // Check if asar backup exists
    if (await fileExists(slackAsarBak)) {
        const fileContents = await fs.readFile(slackAsar);

        // Check if files have already been patched
        const patchIdentifier = '//Patch from https://github.com/marchica/slack-black-theme';
        if (fileContents.includes(patchIdentifier)) {
            console.log('Already patched! Will re-apply...');
            await fs.copyFile(slackAsarBak, slackAsar);
        }
    } else {
        // Backup original asar
        await fs.copyFile(slackAsar, slackAsarBak);
    }

    // Unpack asar
    try {
        asar.extractAll(slackAsar, slackAsarUnpacked);
    } catch (e) {
        console.log(e);
        console.error('Unable to extract Slack\'s asar to patch');
        process.exit(-1);
    }

    // Ensure we have the file to patch
    if(!(await fileExists(slackFile))) {
        console.error('Unable to locate Slack\'s source code to patch');
        process.exit(-1);
    }

    console.log(`Patching file: ${slackAsar}`);

    // Read patch into memory and replace URL
    const urlPlaceholder = 'URL_TO_CSS';
    const url = args.devMode ? 'http://127.0.0.1:8080/custom.css' : 'https://raw.githubusercontent.com/marchica/slack-black-theme/master/dist/custom.css';

    const patchUrl = 'https://raw.githubusercontent.com/marchica/slack-black-theme/master/src/js/SlackPatch.js'; //TODO - update to new path
    let patchContents = (await downloadFile(patchUrl)).replace(urlPlaceholder, url);

    // If dev mode, add dev patch to auto-reload CSS
    if (args.devMode) {
        console.log('Enabling dev mode! ^_^');
        const pathPlaceholder = 'PATH_TO_LOCAL_CSS';
        const path = resolve('./dist/custom.css').replace(/\\/g, '\\\\');

        const devPatchUrl = 'https://raw.githubusercontent.com/marchica/slack-black-theme/master/src/js/DevSlackPatch.js'; //TODO - update to new path
        patchContents += (await downloadFile(devPatchUrl)).replace(pathPlaceholder, path);
    }

    // Add patch to end of slack file
    await fs.appendFile(slackFile, patchContents);

    // Pack new asar
    await asar.createPackage(slackAsarUnpacked, slackAsar);

    // Clean up unpacked folder
    await removeDir(slackAsarUnpacked);

    console.log('Successfully patched!');
    console.log('** Ctrl-R in Slack to refresh **');
};