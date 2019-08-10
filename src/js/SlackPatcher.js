switch(process.argv[2].toLowerCase()) {
    case 'findlatestslackfolder':
        findLatestSlackFolder();
        break;
    case 'installslackpatch':
        installSlackPatch();
        break;
    default:
        console.log('Choose your own adventure: FindLatestSlackFolder, InstallSlackPatch');
}

function findLatestSlackFolder() {
    const fs = require('fs')
    const { join } = require('path')

    const getAppFolders = path => fs.readdirSync(path).filter(folder => fs.statSync(join(path, folder)).isDirectory() && folder.startsWith('app-'))

    let slackPath = join(process.env['LOCALAPPDATA'], 'Slack');
    console.log(slackPath);
    fs.exists(slackPath, (exists) => {
        if (exists)
            console.log(getAppFolders(slackPath));

    });
}

function installSlackPatch() {
    let devMode = !!(process.argv[3] && process.argv[3].toLowerCase() === '-devmode');
}