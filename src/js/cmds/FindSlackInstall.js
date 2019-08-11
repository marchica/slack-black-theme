const fs = require('fs');
const { join } = require('path');
// const semver = require('semver');

module.exports = (args) => {

    // const getAppFolders = path => fs.readdirSync(path).filter(folder => fs.statSync(join(path, folder)).isDirectory() && folder.startsWith('app-'))

    let slackPath = join(process.env['LOCALAPPDATA'], 'Slack');

    fs.exists(slackPath, (exists) => {
        if (exists){
            // let versions = getAppFolders(slackPath).map(folder => folder.replace('app-', ''));
            // let latestVersion = '0.0.0';
            // versions.forEach(version => {
            //     if (semver.gt(version, latestVersion))
            //         latestVersion = version;
            // });
            // slackPath = join(slackPath, `app-${latestVersion}`);
        
            console.log(slackPath);
            return slackPath;
        }
    });
    // console.log(slackPath);
    // return slackPath;
};