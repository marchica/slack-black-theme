const fs = require('fs').promises;
const { join } = require('path');

async function fileExists(file){
    try {
        let stat = await fs.stat(file);
        return stat.isFile();
    } catch (e) {
        return false;
    }
}

module.exports = async (args) => {
    let slackPath = require('./FindLatestSlackVersion')(args);
    slackPath = join(slackPath, 'resources');

    let slackAsarBak = join(slackPath, 'app.asar.bak');
    let slackAsar = join(slackPath, 'app.asar');

    if (await fileExists(slackAsarBak)) {
        await fs.copyFile(slackAsarBak, slackAsar);
        await fs.unlink(slackAsarBak);
        console.log(`Patch uninstalled from ${slackAsar}`);
    }
};