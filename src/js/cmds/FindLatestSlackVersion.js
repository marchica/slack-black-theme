const fs = require('fs');
const { join } = require('path');
const semver = require('semver');

module.exports = (args) => {
    let slackPath = require('./FindSlackInstall')(args);

    const getAppFolders = path => fs.readdirSync(path).filter(folder => fs.statSync(join(path, folder)).isDirectory() && folder.startsWith('app-'));
    const versions = getAppFolders(slackPath).map(folder => folder.replace('app-', ''));
    let latestVersion = '1.0.0';
    versions.forEach(version => {
        if (semver.gt(version, latestVersion))
            latestVersion = version;
    });
    slackPath = join(slackPath, `app-${latestVersion}`);

    console.log(`Latest slack version folder: ${slackPath}`);
    args.slackPath = slackPath;
    return slackPath;
};