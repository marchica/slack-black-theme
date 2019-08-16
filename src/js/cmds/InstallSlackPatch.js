const fs = require('fs').promises;
const { join } = require('path');
const asar = require('asar');

const patch = `
//Patch from https://github.com/marchica/slack-black-theme
var fs = require('fs');
const cssPath = 'PATH_TO_CSS';
document.addEventListener('DOMContentLoaded', function () {
    fs.readFile(cssPath, function(err, css) {
        let s = document.createElement('style');
        s.id = 'slack-custom-css';
        s.type = 'text/css';
        s.innerHTML = css.toString();
        document.head.appendChild(s);
    });
});
window.reloadCss = function() {
    fs.readFile(cssPath, function(err, css) {
        let styleElement = document.querySelector('style#slack-custom-css');
        styleElement.innerHTML = css.toString();
    });
};
fs.watch(cssPath, reloadCss);`;

const fileExists = async function (file) { //TODO - move to shared file
    try {
        let stat = await fs.stat(file);
        return stat.isFile();
    } catch (e) {
        return false;
    }
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

    // Get latest Custom CSS File
    await require('./UpdateCSS')(args);

    // Read patch into memory and replace URL
    const cssPathPlaceholder = 'PATH_TO_CSS';
    const cssPath = join(slackPath, 'CustomTheme.css');
    let patchContents = patch.replace(cssPathPlaceholder, cssPath.replace(/\\/g, '\\\\'));

    // Add patch to end of slack file
    await fs.appendFile(slackFile, patchContents);

    // Pack new asar
    await asar.createPackage(slackAsarUnpacked, slackAsar);

    // Clean up unpacked folder
    await removeDir(slackAsarUnpacked);

    console.log('Successfully patched!');
    console.log(`Custom CSS File: ${cssPath}`);
    console.log('** Ctrl-R in Slack to refresh **');
};