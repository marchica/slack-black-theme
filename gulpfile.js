'use strict';

const { src, dest, watch, series } = require('gulp');
const bump = require('gulp-bump');
const c = require('ansi-colors');
const connect = require('gulp-connect');
const del = require('del');
const eslint = require('gulp-eslint');
const gulpIf = require('gulp-if');
const log = require('fancy-log');
const minimist = require('minimist');
const pkg = require('pkg');

let config = {
    paths: {
        root: './',

        /* Input */
        cssFiles: './src/css/*.css',
        gulpFile: './gulpfile.js',
        jsFiles: './src/js/**/*.js',
        packageJson: './package.json',

        /* Output */
        exes: './release',
        output: './dist/'
    }
};

function isFixed(file) {
    return file.eslint != null && file.eslint.fixed;
}

function lint() {
    return src([config.paths.gulpFile, config.paths.jsFiles], {base: config.paths.root})
        .pipe(eslint({fix: true}))
        .pipe(eslint.format())
        .pipe(gulpIf(isFixed, dest(config.paths.root)))
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
    require('./src/js/cmds/LaunchSlack')(minimist([])); //TODO - not sure this ever completes
    cb();
    log.info(c.bold.magenta('** Ctrl-Alt-I to open dev tools in Slack **'));
    log.info(c.bold.magenta('** Ctrl-R to refresh Slack after CSS changes **'));
}

function installSlackPatch(cb) {
    log.info('Installing Slack patch');
    require('./src/js/cmds/InstallSlackPatch')(minimist(['--devMode']));
    cb(); //TODO - cb happens before it finishes...
}

function uninstallSlackPatch(cb) {
    log.info('Uninstalling Slack patch');
    require('./src/js/cmds/UninstallSlackPatch')(minimist([]));
    cb();
}

async function createExecutables() {
    await pkg.exec([ '.', '--out-path', config.paths.exes ]);
}

function versionBump() {
    const args = minimist(process.argv.slice(2));
    let options = {};
    let type = args.type;
    let version = args.version;
    if (version)
        options.version = version;
    else if (type)
        options.type = type;
    else
        options.type = 'prerelease';
    return src([config.paths.packageJson])
        .pipe(bump(options))
        .pipe(dest(config.paths.root));
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
exports.versionBump = versionBump;
exports.default = series(clean, build, server, launchSlack, watcher);