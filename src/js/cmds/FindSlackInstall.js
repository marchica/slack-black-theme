const fs = require('fs');
const { join } = require('path');

const isWindows = process.platform === 'win32';

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

    if (!slackPath){
        console.error('Unable to locate Slack installation!');
        process.exit(-1);
    }
    console.log(`Slack installed: ${slackPath}`);
    return slackPath;
};