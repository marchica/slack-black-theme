const { version } = require('../../../package.json');

module.exports = () => {
    console.log(`Slack Patcher version: ${version}`);
};