'use strict';

const { src, dest, watch, series } = require('gulp');
const c = require('ansi-colors');
const connect = require('gulp-connect');
const del = require('del');
const eslint = require('gulp-eslint');
const gulpIf = require('gulp-if');
const log = require('fancy-log');
const pkg = require('pkg');

const slackPatcher = require('./src/js/SlackPatcher');

let config = {
    paths: {
        base: './',

        /* Input */
        cssFiles: './src/css/*.css',
        gulpFile: './gulpfile.js',
        jsFiles: './src/js/**/*.js',

        /* Output */
        exes: './release',
        output: './dist/'
    }
};

function isFixed(file) {
    return file.eslint != null && file.eslint.fixed;
}

function lint() {
    return src([config.paths.gulpFile, config.paths.jsFiles], {base: config.paths.base})
        .pipe(eslint({fix: true}))
        .pipe(eslint.format())
        .pipe(gulpIf(isFixed, dest(config.paths.base)))
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

async function launchSlack(cb) {
    log.info('Launching Slack in developer mode');
    slackPatcher(cb);
    log.info(c.bold.magenta('** Ctrl-Alt-I to open dev tools in Slack **'));
    log.info(c.bold.magenta('** Ctrl-R to refresh Slack after CSS changes **'));
}

function installSlackPatch(cb) {
    log.info('Installing Slack patch');
    slackPatcher(cb); //TODO - how to force --devMode flag?
}

function uninstallSlackPatch(cb) {
    log.info('Uninstalling Slack patch');
    slackPatcher(cb);
}

async function createExecutables() {
    await pkg.exec([ '.', '--out-path', config.paths.exes ]);
}

function css() {
    return src(config.paths.cssFiles)
        .pipe(dest(config.paths.output));
}

function watcher() {
    watch([config.paths.cssFiles], css);
    watch([config.paths.gulpFile, config.paths.jsFiles], lint);
}

function clean() {
    return del([config.paths.output, config.paths.exes]);
}

function build() {
    return css();
}

exports.build = build;
exports.clean = clean;
exports.lint = lint;
exports.launchSlack = launchSlack;
exports.installSlackPatch = installSlackPatch;
exports.uninstallSlackPatch = uninstallSlackPatch;
exports.createExecutables = createExecutables;
exports.default = series(clean, build, server, launchSlack, watcher);