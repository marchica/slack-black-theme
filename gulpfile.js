'use strict';

const { src, dest, watch, series } = require('gulp');
const del = require('del');
const connect = require('gulp-connect');
const exec = require('child_process').exec;

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

function startSlack(cb) {
    //TODO - detect latest version
    exec('set SLACK_DEVELOPER_MENU=true && %LocalAppData%\\slack\\app-3.4.0\\slack.exe', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
    cb();
}

function css(cb) {
    src(config.paths.input)
        .pipe(dest(config.paths.output));
    cb();
}

function watcher(cb) {
    watch([config.paths.input], css);
    cb();
}

function clean() {
    return del([config.paths.output]);
}

function build(cb) {
    css(cb);
    cb();
}

exports.build = build;
exports.clean = clean;
exports.startSlack = startSlack;
exports.default = series(clean, build, server, startSlack, watcher);