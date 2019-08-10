'use strict';

const { src, dest, watch, series } = require('gulp');
const c = require('ansi-colors');
const connect = require('gulp-connect');
const del = require('del');
const eslint = require('gulp-eslint');
const log = require('fancy-log');

const slackPatcher = require('./src/js/SlackPatcher');


let config = {
    paths: {
        /* Input */
        cssFiles: './src/css/*.css',
        gulpFile: './gulpfile.js',
        jsFiles: './src/js/SlackPatcher.js', //TODO: include all?

        /* Output */
        output: './dist/'
    }
};

function lint() {
    return src([config.paths.gulpFile, config.paths.jsFiles])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

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

async function startSlack() {
    log.info('Launching Slack in developer mode');
    slackPatcher.launchSlack();
    log.info(c.bold.magenta('** Ctrl-Alt-I to open dev tools in Slack **'));
    log.info(c.bold.magenta('** Ctrl-R to refresh Slack after CSS changes **'));
    await Promise.resolve();
}

function installSlackPatch() {
    log.info('Installing Slack patch');
    //Install-SlackPatch -DevMode`);
}

function uninstallSlackPatch() {
    log.info('Uninstalling Slack patch');
    // Uninstall-SlackPatch`);
}

// function formatPSTestResults(output) {
//     let tests = JSON.parse(output);
    
//     if (!Array.isArray(tests))
//         tests = new Array(tests);

//     const failures = tests.filter(test => !test.Passed);
//     const totalTests = tests.length;
//     const failedTests = failures.length;
//     const passedTests = totalTests - failedTests;

//     failures.forEach(test => {
//         log.error(c.bold.red(`Failed test: ${test.Name}`));
//         log.error(test.FailureMessage);
//     });

//     log(c.cyan(`${passedTests} of ${totalTests} passed. `) + (failedTests ? c.red(`${failedTests} failed.`) : ''));

//     if (totalTests === passedTests)
//         log(c.green('ALL TESTS PASSED!  \\(ᵔᵕᵔ)/'));
// }

function css() {
    return src(config.paths.cssFiles)
        .pipe(dest(config.paths.output));
}

function watcher() {
    watch([config.paths.cssFiles], css);
    watch([config.paths.gulpFile, config.paths.jsFiles], lint);
}

function clean() {
    return del([config.paths.output]);
}

function build() {
    return css();
}

exports.build = build;
exports.clean = clean;
exports.lint = lint;
exports.startSlack = startSlack;
exports.installSlackPatch = installSlackPatch;
exports.uninstallSlackPatch = uninstallSlackPatch;
exports.default = series(clean, build, server, startSlack, watcher);