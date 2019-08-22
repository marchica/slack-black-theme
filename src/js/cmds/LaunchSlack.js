const exec = require('child_process').execFile;
const { join } = require('path');

module.exports = async (args) => {
    const slackBasePath = require('./FindSlackInstall')(args);

    if (!slackBasePath) {
        return;
    }

    process.env['SLACK_DEVELOPER_MENU'] = true;

    exec(join(slackBasePath, 'slack.exe'), function(err, data) {
        if (err)
            console.error(err);
        if (data && data.trim())
            console.log(data.toString());
    });
};