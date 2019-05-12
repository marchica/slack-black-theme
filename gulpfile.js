'use strict';

const { src, dest, watch, series } = require('gulp');
const del = require('del');
const connect = require('gulp-connect');

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

function css(cb) {
    src(config.paths.input)
        .pipe(dest(config.paths.output));
    cb();
}

function watch(cb) {
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
exports.default = series(clean, build, server, watch);