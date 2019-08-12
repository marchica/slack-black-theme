const fs = require('fs');
const { join } = require('path');

module.exports = (args) => {
    console.log(`DevMode: ${args.devMode}`);

    // Find correct Slack folder
    let slackPath = require('./FindLatestSlackVersion')(args);
    slackPath = join(slackPath, 'resources');

    let slackAsarBak = join(slackPath, 'app.asar.bak');
    let slackAsar = join(slackPath, 'app.asar');

    if(!fs.statSync(slackAsar).isFile()) { //TODO - will throw execption - change to async?
        console.error('Unable to locate Slack\'s source code to patch');
        process.exit(-1);
    }

    // Backup original files
    fs.stat(slackAsarBak, (err) => {
        if (err) {
            fs.copyFile(slackAsar, slackAsarBak, (err) => {
                if (err) throw err;
            });
        }
    });

    // // Read slack file into memory
    // $fileContents = Get-Content $slackFile

    // // Check if files have already been patched
    // $patchIdentifier = '//Patch from https://github.com/marchica/slack-black-theme'

    // if ($fileContents | Select-String -Pattern $patchIdentifier -SimpleMatch -Quiet) {
    //     console.log('Already patched! Will re-apply...');
    //     Copy-Item -Path "$slackFile.bak" -Destination $slackFile
    // }

    // console.log(`Patching file: $slackFile`);

    // // Read patch into memory and replace URL
    //const urlPlaceholder = 'URL_TO_CSS';
    //const url = args.devMode ? 'http://127.0.0.1:8080/custom.css' : 'https://raw.githubusercontent.com/marchica/slack-black-theme/master/dist/custom.css';

    // $patchContents = (Invoke-WebRequest 'https://raw.githubusercontent.com/marchica/slack-black-theme/master/src/js/SlackPatch.js' -UseBasicParsing).Content.Replace($urlPlaceholder, $url)

    // // Add patch to end of slack file
    // Add-Content -Path $slackFile -Value $patchContents

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