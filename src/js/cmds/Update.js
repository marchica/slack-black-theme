const fs = require('fs');
const semver = require('semver');
const tmp = require('tmp');
const { spawn } = require('child_process');
const { version } = require('../../../package.json');
const { downloadFile } = require('./../Utils');
const path = require('path');

module.exports = async () => {
    const execPath = process.execPath;
    if (execPath.includes('node.exe')) {
        console.log('Can only update when running from the executable.');
        return;
    }
    console.log(`Current version: ${version}`);

    // Check for new version
    let latestVersion = JSON.parse(await downloadFile('https://raw.githubusercontent.com/marchica/slack-black-theme/master/package.json')).version;
    console.log(`Latest version: ${latestVersion}`);

    // If new version, download updater.exe to tmp folder
    if (semver.gt(latestVersion, version)) {
        console.log('Updating...');

        let updaterPath = path.join(__dirname, '../../../release-updater/updater.exe');

        //TODO - make sure this is deleted on reboot
        const target = tmp.fileSync({keep: true, postfix: '.exe', discardDescriptor: true }).name;

        fs.writeFileSync(target, fs.readFileSync(updaterPath));

        // await fs.chmod(target, 0o765); //TODO - need to grant execute permission?

        // Run updater.exe and pass exec location
        let logFile = tmp.fileSync({ prefix: 'slackpatcherupdate-', postfix: '.log'}).name;
        let out = fs.openSync(logFile, 'a'),
            err = fs.openSync(logFile, 'a');

        spawn(target, [`--execPath=${execPath}`, `--version=${latestVersion}`], {
            stdio: ['ignore', out, err],
            detached: true
        }).unref();
    } else {
        console.log('Up to date!');
    }
};