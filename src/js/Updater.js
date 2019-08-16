'use strict';

const fs = require('fs').promises;
const minimist = require('minimist');
const { fileExists } = require('./Utils');

const update = async function() {
    const args = minimist(process.argv.slice(2));
    const execPath = args.execPath;

    if (!execPath || !(await fileExists(execPath))) {
        console.error('Error: must specify an existing exe to update');
        process.exit(-1);
    }

    console.log(`Downloading latest exe to ${execPath}`);

    //TODO - download instead of reading from disk
    const newExec = await fs.readFile('C:\\Users\\Marcy\\Code\\slack\\slack-black-theme\\readme.md');

    await fs.writeFile(execPath, newExec);
};

update();