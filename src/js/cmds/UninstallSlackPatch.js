const fs = require('fs');
const { join } = require('path');

module.exports = (args) => {
    let slackPath = require('./FindLatestSlackVersion')(args);
    slackPath = join(slackPath, 'resources');

    let slackAsarBak = join(slackPath, 'app.asar.bak');
    let slackAsar = join(slackPath, 'app.asar');

    fs.stat(slackAsarBak, (err) => {
        if (!err) {
            fs.copyFile(slackAsarBak, slackAsar, (err) => {
                if (err) throw err;
                fs.unlink(slackAsarBak, (err) => {
                    if (err) throw err;
                    console.log(`Patch uninstalled from ${slackAsar}`);
                });
            });
        }
    });
};