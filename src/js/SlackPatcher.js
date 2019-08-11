'use strict';

const minimist = require('minimist')

const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';

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
            installSlackPatch();
            break;

        case 'version':
            require('./cmds/Version')(args);
            break;

        case 'help':
            require('./cmds/Help')(args);
            break;

        default:
            console.error(`"${cmd}" is not a valid command!`);
        break;
    }
}



function installSlackPatch() {
    let devMode = !!(process.argv[3] && process.argv[3].toLowerCase() === '-devmode');
    console.log(`DevMode: ${devMode}`);

}
