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
    let ps = new shell({
        executionPolicy: 'Bypass',
        noProfile: true
    });
      
    ps.addCommand('. .\\scripts.ps1; StartSlack')
    return ps.invoke()
        .then(output => {
            console.log(output);
            printDevInfo();
            ps.dispose();
        })
        .catch(err => {
            console.log(err);
            ps.dispose();
        });
}

function printDevInfo() {
    log.info(c.bold.magenta('** Ctrl-Alt-I to open dev tools in Slack **'));
    log.info(c.bold.magenta('** Ctrl-R to refresh Slack after CSS changes **'));
}

function css() {
    return src(config.paths.input)
        .pipe(dest(config.paths.output));
}

function watcher() {
    watch([config.paths.input], css);
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
exports.default = series(clean, build, server, startSlack, watcher);