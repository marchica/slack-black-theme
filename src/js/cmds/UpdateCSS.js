const fs = require('fs').promises;
const { join } = require('path');
const { fileExists, downloadFile } = require('./../Utils');

module.exports = async (args) => {
    let slackPath = args.slackPath ? args.slackPath : require('./FindLatestSlackVersion')(args);
    slackPath = join(slackPath, 'resources');
    const cssFile = join(slackPath, 'CustomTheme.css');
    const localFile = './dist/custom.css';
    if (args.devMode && await fileExists(localFile)) {
        await fs.copyFile(localFile, cssFile);
        return;
    }
    const url = args.devBranch
        ? 'https://raw.githubusercontent.com/marchica/slack-black-theme/dev/dist/custom.css'
        : 'https://raw.githubusercontent.com/marchica/slack-black-theme/master/dist/custom.css';
    await fs.writeFile(cssFile, await downloadFile(url));
};