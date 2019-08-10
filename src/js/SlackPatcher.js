'use strict';

switch(process.argv[2].toLowerCase()) {
    case 'findlatestslackfolder':
        findLatestSlackFolder();
        break;
    case 'launchslack':
        launchSlack();
        break; 
    case 'installslackpatch':
        installSlackPatch();
        break;
    default:
        console.log('Choose your own adventure: FindLatestSlackFolder, InstallSlackPatch');
}

function findLatestSlackFolder() {
    const fs = require('fs');
    const { join } = require('path');
    const semver = require('semver');

    const getAppFolders = path => fs.readdirSync(path).filter(folder => fs.statSync(join(path, folder)).isDirectory() && folder.startsWith('app-'))

    let slackPath = join(process.env['LOCALAPPDATA'], 'Slack');

    fs.exists(slackPath, (exists) => {
        if (exists){
            let versions = getAppFolders(slackPath).map(folder => folder.replace('app-', ''));
            let latestVersion = '0.0.0';
            versions.forEach(version => {
                if (semver.gt(version, latestVersion))
                    latestVersion = version;
            });
            slackPath = join(slackPath, `app-${latestVersion}`);
            
        }
    });
    console.log(slackPath);
    return slackPath;
}

function installSlackPatch() {
    let devMode = !!(process.argv[3] && process.argv[3].toLowerCase() === '-devmode');
    console.log(`DevMode: ${devMode}`)
}

function launchSlack() {
    var exec = require('child_process').execFile;
    const { join } = require('path');

    const slackBasePath = findLatestSlackFolder(); //TODO - should this include version folder?

    if (!slackBasePath) {
        return;
    }

    process.env['SLACK_DEVELOPER_MENU'] = true;

    exec(join(slackBasePath, 'slack.exe'), function(err, data) {  
        console.log(err)
        console.log(data.toString());                       
    });
}

exports.launchSlack = launchSlack;