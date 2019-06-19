'use strict';

const { src, dest, watch, series } = require('gulp');
const c = require('ansi-colors');
const connect = require('gulp-connect');
const del = require('del');
const log = require('fancy-log');
const shell = require('node-powershell');

let config = {
    paths: {
        cssFiles: './src/css/*.css',
        powerShellFiles: './src/ps/*.ps1',
        powerShellScript: '.\\src\\ps\\scripts.ps1',
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
    log.info('Launching Slack in developer mode');
    return runPowerShellScript(`. ${config.paths.powerShellScript}; Invoke-SlackDevMode`, printDevInfo);
}

function printDevInfo() {
    log.info(c.bold.magenta('** Ctrl-Alt-I to open dev tools in Slack **'));
    log.info(c.bold.magenta('** Ctrl-R to refresh Slack after CSS changes **'));
}

function installSlackPatch() {
    log.info('Installing Slack patch');
    return runPowerShellScript(`. ${config.paths.powerShellScript}; Install-SlackPatch -DevMode`);
}

function uninstallSlackPatch() {
    log.info('Uninstalling Slack patch');
    return runPowerShellScript(`. ${config.paths.powerShellScript}; Uninstall-SlackPatch`);
}

function runPSTests() {
    log.info('Running PowerShell tests');
    return runPowerShellScript('Invoke-Pester -PassThru -Show None | Select-Object -ExpandProperty TestResult | ConvertTo-Json -Compress', formatPSTestResults);
}

function formatPSTestResults(output) {
    let tests = JSON.parse(output);
    
    if (!Array.isArray(tests))
        tests = new Array(tests);

    const failures = tests.filter(test => !test.Passed);
    const totalTests = tests.length;
    const failedTests = failures.length;
    const passedTests = totalTests - failedTests;

    failures.forEach(test => {
        log.error(c.bold.red(`Failed test: ${test.Name}`));
        log.error(test.FailureMessage);
    });

    log(c.cyan(`${passedTests} of ${totalTests} passed. `) + (failedTests ? c.red(`${failedTests} failed.`) : ''));

    if (totalTests === passedTests)
        log(c.green('ALL TESTS PASSED!  \\(ᵔᵕᵔ)/'));
}

function runPowerShellScript(command, cb) {
    let ps = new shell({
        executionPolicy: 'Bypass',
        noProfile: true
    });
    ps.addCommand(command);
    return ps.invoke()
        .then(output => {
            if (cb)
                cb(output);
            else if (output) 
                log(output);
        })
        .catch(err => {
            log.error(err);
        })
        .then(() => {
            ps.dispose();
        });
}

function css() {
    return src(config.paths.cssFiles)
        .pipe(dest(config.paths.output));
}

function watcher() {
    watch([config.paths.cssFiles], css);
    watch([config.paths.powerShellFiles], runPSTests);
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
exports.runTests = runPSTests;
exports.default = series(clean, build, server, startSlack, watcher);