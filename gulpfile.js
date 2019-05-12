'use strict';

const gulp = require('gulp');
const del = require('del');
const connect = require('gulp-connect');

function server(cb) {
    let cors = function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    };

    connect.server({
        root: 'dist',
        middleware: function () {
            return [cors];
          }
    });
    cb();
}

function css(cb) {
    gulp.src('src/*')
        .pipe(gulp.dest('dist'))
    cb();
}

function watch(cb) {
    gulp.watch(['src'], css);
    cb();
}

function clean() {
    return del(['dist/']);
}

function build(cb) {
    css(cb);
    cb();
}

exports.build = build;
exports.clean = clean;
exports.default = gulp.series(clean, build, server, watch);