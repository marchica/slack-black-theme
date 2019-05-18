'use strict';

const { src, dest, watch, series } = require('gulp');
const c = require('ansi-colors');
const connect = require('gulp-connect');
const del = require('del');
const log = require('fancy-log');
const shell = require('node-powershell');

let config = {
    paths: {
        input: './src/*',
        output: './dist/'
    }
};

function server(cb) {
    let cors = function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    };

    connect.server({
        root: config.paths.output,
        middleware: function () {
            return [cors];
          }
    });
    cb();
}

function startSlack() {
    log.info('Launching Slack');
    return runPowershellScript('. .\\scripts.ps1; StartSlack', printDevInfo);
}

function printDevInfo() {
    log.info(c.bold.magenta('** Ctrl-Alt-I to open dev tools in Slack **'));
    log.info(c.bold.magenta('** Ctrl-R to refresh Slack after CSS changes **'));
}

function installSlackPatch() {
    log.info('Installing Slack patch');
    return runPowershellScript('. .\\scripts.ps1; InstallSlackPatch');
}

function uninstallSlackPatch() {
    log.info('Uninstalling Slack patch');
    return runPowershellScript('. .\\scripts.ps1; UninstallSlackPatch');
}

function runPSTests() {
    log.info('Running PS tests');
    return runPowershellScript('Invoke-Pester');
}

function runPowershellScript(command, cb) {
    let ps = new shell({
        executionPolicy: 'Bypass',
        noProfile: true
    });
    ps.addCommand(command);
    return ps.invoke()
        .then(output => {
            console.log(output);
            if (cb)
                cb();
            ps.dispose();
        })
        .catch(err => {
            console.log(err);
            ps.dispose();
        });
}

function css() {
    return src(config.paths.input)
        .pipe(dest(config.paths.output));
}

function watcher() {
    watch([config.paths.input], css);
    watch(['./scripts.ps1'], runPSTests);
}

function clean() {
    return del([config.paths.output]);
}

function build() {
    return css();
}

exports.build = build;
exports.clean = clean;
exports.startSlack = startSlack;
exports.installSlackPatch = installSlackPatch;
exports.uninstallSlackPatch = uninstallSlackPatch;
exports.default = series(clean, build, server, startSlack, watcher);