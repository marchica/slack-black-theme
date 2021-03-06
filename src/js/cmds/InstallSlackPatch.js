const asar = require('asar');
const fs = require('fs').promises;
const fsSync = require('fs');
const { join } = require('path');
const { fileExists, removeDir } = require('./../Utils');

module.exports = async (args) => {
    // Find correct Slack folder
    let slackPath = require('./FindLatestSlackVersion')(args);
    slackPath = join(slackPath, 'resources');

    let slackAsar = join(slackPath, 'app.asar');
    let slackAsarBak = join(slackPath, 'app.asar.bak');
    let slackAsarUnpacked = join(slackPath, 'appTEST.asar.unpacked');
    let slackFile = join(slackAsarUnpacked, 'dist', 'ssb-interop.bundle.js');

    // Ensure we have the asar
    if (!(await fileExists(slackAsar))) {
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
    if (!(await fileExists(slackFile))) {
        console.error('Unable to locate Slack\'s source code to patch');
        process.exit(-1);
    }

    console.log(`Patching file: ${slackAsar}`);

    // Get latest Custom CSS File
    await require('./UpdateCSS')(args);

    // Read patch into memory and replace URL
    const cssPathPlaceholder = 'PATH_TO_CSS';
    const cssPath = join(slackPath, 'CustomTheme.css');
    const patchFile = join(__dirname, '../patch/SlackPatch.js');
    let patchContents = (fsSync.readFileSync(patchFile)).toString();
    patchContents = patchContents.replace(cssPathPlaceholder, cssPath.replace(/\\/g, '\\\\'));

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