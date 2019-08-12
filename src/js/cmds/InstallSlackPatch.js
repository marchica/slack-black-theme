const fs = require('fs').promises;
const { join } = require('path');
const asar = require('asar');

async function fileExists(file){
    try {
        let stat = await fs.stat(file);
        return stat.isFile();
    } catch (e) {
        return false;
    }
}

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

    // Backup original asar
    if (!(await fileExists(slackAsarBak)))
        await fs.copyFile(slackAsar, slackAsarBak);

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

    // Read slack file into memory
    try {
        const fileContents = await fs.readFile(slackFile);

        // Check if files have already been patched
        const patchIdentifier = '//Patch from https://github.com/marchica/slack-black-theme';

        if (fileContents.includes(patchIdentifier)) {
            console.log('Already patched! Will re-apply...'); //TODO - how to reapply from here?
        //Copy-Item -Path "$slackFile.bak" -Destination $slackFile
        }
    } catch (e) {
        console.log(`Error reading source file: ${e}`);
    }

    console.log('Patching file: $slackFile');

    // Read patch into memory and replace URL
    const urlPlaceholder = 'URL_TO_CSS';
    const url = args.devMode ? 'http://127.0.0.1:8080/custom.css' : 'https://raw.githubusercontent.com/marchica/slack-black-theme/master/dist/custom.css';

    //$patchContents = (Invoke-WebRequest 'https://raw.githubusercontent.com/marchica/slack-black-theme/master/src/js/SlackPatch.js' -UseBasicParsing).Content.Replace($urlPlaceholder, $url)

    // Add patch to end of slack file
    //Add-Content -Path $slackFile -Value $patchContents

    // // If dev mode, add dev patch to auto-reload CSS
    // if (args.devMode) {
    //     $pathPlaceholder = 'PATH_TO_LOCAL_CSS'
    //     $path = (Join-Path (Resolve-Path $PSScriptRoot\..\..) dist\custom.css).Replace('\', '\\')

    //     $devPatchContents = (Invoke-WebRequest 'https://raw.githubusercontent.com/marchica/slack-black-theme/master/src/js/DevSlackPatch.js' -UseBasicParsing).Content.Replace($pathPlaceholder, $path)

    //     // Add patch to end of slack file
    //     Add-Content -Path $slackFile -Value $devPatchContents
    // }

    console.log('Successfully patched!');
    console.log('** Ctrl-R in Slack to refresh **');
};