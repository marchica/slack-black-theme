const { version } = require('../../../package.json');

module.exports = () => {
    console.log(`Version: ${version}`);
};