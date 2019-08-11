const fs = require('fs');
const { join } = require('path');
// const semver = require('semver');

const isWindows = process.platform === 'win32';
// const isLinux = process.platform === 'linux';

module.exports = (args) => {
    let pathsToCheck = [];
    if (args.slackInstallPath)
        pathsToCheck.push(args.slackInstallPath);
    if (isWindows) {
        pathsToCheck.push(join(process.env['LOCALAPPDATA'], 'Slack'));
        pathsToCheck.push(join(process.env['PROGRAMFILES'], 'Slack'));
    }

    let slackPath = pathsToCheck.find(path => {
        try {
            return fs.statSync(path).isDirectory() && fs.statSync(join(path, 'slack.exe')).isFile();
        }
        catch (e) {
            return false;
        }
    });
    // const getAppFolders = path => fs.readdirSync(path).filter(folder => fs.statSync(join(path, folder)).isDirectory() && folder.startsWith('app-'))
    // fs.exists(slackPath, (exists) => {
    //     if (exists){
    //         // let versions = getAppFolders(slackPath).map(folder => folder.replace('app-', ''));
    //         // let latestVersion = '0.0.0';
    //         // versions.forEach(version => {
    //         //     if (semver.gt(version, latestVersion))
    //         //         latestVersion = version;
    //         // });
    //         // slackPath = join(slackPath, `app-${latestVersion}`);

    //         console.log(slackPath);
    //         return slackPath;
    //     }
    // });
    console.log(slackPath);
    return slackPath;
};