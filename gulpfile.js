'use strict';

const { src, dest, watch, series } = require('gulp');
const del = require('del');
const connect = require('gulp-connect');
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

function startSlack(cb) {
    let ps = new shell({
        executionPolicy: 'Bypass',
        noProfile: true
      });
      
      ps.addCommand('. .\\scripts.ps1; StartSlack')
      ps.invoke()
      .then(output => {
        console.log(output);
        ps.dispose();
      })
      .catch(err => {
        console.log(err);
        ps.dispose();
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