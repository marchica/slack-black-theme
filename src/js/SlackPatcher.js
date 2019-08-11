'use strict';

const minimist = require('minimist');

module.exports = () => {
    const args = minimist(process.argv.slice(2));

    let cmd = args._[0] || 'help';

    if (args.version || args.v) {
        cmd = 'version';
    }

    if (args.help || args.h) {
        cmd = 'help';
    }

    switch (cmd.toLowerCase()) {
    case 'findslackinstall':
        require('./cmds/FindSlackInstall')(args);
        break;

    case 'launchslack':
        require('./cmds/LaunchSlack')(args);
        break;

    case 'installslackpatch':
        require('./cmds/InstallSlackPatch')(args);
        break;

    case 'version':
        require('./cmds/Version')(args);
        break;

    case 'help':
        require('./cmds/Help')(args);
        break;

    default:
        console.error(`"${cmd}" is not a valid command!`);
        process.exit(-1);
        break;
    }
};