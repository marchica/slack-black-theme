const { version, name, author, description } = require('../../../package.json');

const os = process.platform === 'win32' ? 'win.exe' : process.platform === 'darwin' ? 'macos' : 'linux';
const exeName = `${name}-${os}`;

const menus = {
    main: `
${name} (v${version}) by ${author}
${description}

Usage:
    ${exeName} [command] <options>

Options:
    install ............ install the slack patch
    uninstall .......... uninstall the slack patch
    version ............ show package version
    help ............... show help menu for a command`,

    install: `
Usage:
    ${exeName} install <options>
            Applies a patch for a dark theme to the highest version of the first Slack install located

Options:
    --slackInstallLocation ..... the location of slack install if you wish to override (optional)`,

    uninstall: `
Usage:
    ${exeName} uninstall <options>
        Removes the patch previously installed for the highest version of the first Slack install located

Options:
    --slackInstallLocation ..... the location of slack install if you wish to override (optional)`
};

module.exports = (args) => {
    const subCmd = args._[0] === 'help'
        ? args._[1]
        : args._[0];

    console.log(menus[subCmd] || menus.main);
};