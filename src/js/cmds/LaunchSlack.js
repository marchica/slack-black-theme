const exec = require('child_process').execFile;
const { join } = require('path');

module.exports = (args) => {
    console.log('launching slack', args);
    return;
    const slackBasePath = findLatestSlackFolder(); //TODO - should this include version folder?

    if (!slackBasePath) {
        return;
    }

    process.env['SLACK_DEVELOPER_MENU'] = true;

    exec(join(slackBasePath, 'slack.exe'), function(err, data) {  
        console.log(err)
        console.log(data.toString());                       
    });
}