'use strict';

const fs = require('fs').promises;
const minimist = require('minimist');
const { fileExists, downloadFile, exeName } = require('./Utils');

const update = async function() {
    const args = minimist(process.argv.slice(2));
    const version = args.version;
    const execPath = args.execPath;

    if (!version) {
        console.error('Error: must specify a version to update to');
        process.exit(-1);
    }

    if (!execPath || !(await fileExists(execPath))) {
        console.error('Error: must specify an existing exe to update');
        process.exit(-1);
    }

    const exeUrl = `https://github.com/marchica/slack-black-theme/releases/download/${version}/${exeName}}`;

    console.log(`Downloading latest exe from ${exeUrl}`);
    const newExec = await downloadFile(exeUrl);

    console.log(`Writing latest exe to ${execPath}`);
    await fs.writeFile(execPath, newExec);
};

update();