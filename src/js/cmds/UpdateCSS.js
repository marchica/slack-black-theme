const fs = require('fs').promises;
const { join } = require('path');
const { fileExists, downloadFile } = require('./../Utils');

module.exports = async (args) => {
    let slackPath = require('./FindLatestSlackVersion')(args);
    slackPath = join(slackPath, 'resources');
    const cssFile = join(slackPath, 'CustomTheme.css');

    const localFile = './dist/custom.css';
    if (args.devMode && await fileExists(localFile)) {
        await fs.copyFile(localFile, cssFile);
        return;
    }
    const url = 'https://raw.githubusercontent.com/marchica/slack-black-theme/master/dist/custom.css';
    await fs.writeFile(cssFile, await downloadFile(url));
};