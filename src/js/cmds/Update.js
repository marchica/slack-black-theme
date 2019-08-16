const fs = require('fs').promises;
const fsSync = require('fs');
const semver = require('semver');
const { spawn } = require('child_process');
const { version } = require('../../../package.json');
const { downloadFile } = require('./../Utils');

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

    latestVersion = '5.0.0'; //TODO - delete!

    // If new version, download updater.exe to tmp folder
    if (semver.gt(latestVersion, version)) {
        console.log('Updating...'); //TODO - take out if figure out pipe

        //TODO - download to tmp folder, run, and delete updater.exe
        const updaterPath = './release-updater/Updater-win.exe';

        // Run updater.exe and pass exec location
        var out = fsSync.openSync('./out.log', 'a'),
            err = fsSync.openSync('./out.log', 'a');

        spawn(updaterPath, [`--execPath=${execPath}`], {
            stdio: ['ignore', out, err],
            detached: true
        }).unref();
    } else {
        console.log('Up to date!');
    }
};