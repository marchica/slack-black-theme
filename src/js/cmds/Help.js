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
  install                         Install the Slack patch
  uninstall                       Uninstall the Slack patch
  updatecss                       Update CSS with latest fixes
  update                          Update this exe to the latest version
  version                         Show package version
  help [command]                  Show help menu for a command`,

    install: `
Usage:
  ${exeName} install <options>
    Applies a patch for a dark theme to the highest version of the first Slack install located

Options:
  --slackInstallLocation          The location of Slack install if you wish to override (optional)`,

    uninstall: `
Usage:
  ${exeName} uninstall <options>
    Removes the patch previously installed for the highest version of the first Slack install located

Options:
  --slackInstallLocation          Location of Slack install if you wish to override (optional)`,

    updatecss: `
Usage:
  ${exeName} updatecss <options>
    Updates the CustomTheme.css file with the latest fixes from GitHub

Options:
  --devMode                       If developing, use the latest from disk`,

    update: `
Usage:
${exeName} update
  Updates the ${exeName} with the latest version from GitHub`
};

module.exports = (args) => {
    const subCmd = args._[0] === 'help' ? args._[1] : args._[0];

    console.log(menus[subCmd] || menus.main);
};