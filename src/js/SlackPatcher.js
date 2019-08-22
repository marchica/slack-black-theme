'use strict';

const minimist = require('minimist');

module.exports = async () => {
    const args = minimist(process.argv.slice(2));

    let cmd = args._[0] || '';

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

    case 'findlatestslackversion':
        require('./cmds/FindLatestSlackVersion')(args);
        break;

    case 'launchslack':
        await require('./cmds/LaunchSlack')(args);
        break;

    case 'updatecss':
        await require('./cmds/UpdateCSS')(args);
        break;

    case 'installslackpatch':
    case 'install':
    case '':
        await require('./cmds/InstallSlackPatch')(args);
        break;

    case 'uninstallslackpatch':
    case 'uninstall':
        await require('./cmds/UninstallSlackPatch')(args);
        break;

    case 'update':
        await require('./cmds/Update')(args);
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

    // On Windows, title is set when exe launched from explorer
    // So if launched from explorer, keep the window open
    if (cmd === '' && process.title.trim()) {
        console.log('Press any key to exit...');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 0));
    }
};

//TODO - console.log vs process.stdout.write ?