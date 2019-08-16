const { join } = require('path');
const fs = require('fs').promises;
const https = require('https');

const fileExists = async function (file) {
    try {
        let stat = await fs.stat(file);
        return stat.isFile();
    } catch (e) {
        return false;
    }
};

const downloadFile = function (url) {
    return new Promise(function(resolve, reject) {
        https.get(url, (res) => {
            if (res.statusCode != 200) {
                reject(res.statusCode);
                return;
            }
            let data = '';
            res.on('data', (d) => {
                data += d;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
};

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