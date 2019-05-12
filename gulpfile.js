var gulp = require('gulp');
var connect = require('gulp-connect');

function server(cb) {
    var cors = function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        //res.setHeader('Access-Control-Allow-Headers', 'headers_you_want_to_accept');
        next();
    };

    connect.server({
        root: 'public',
        middleware: function () {
            return [cors];
          }
    });
    cb();
}

function clean(cb) {
    //TODO
    cb();
}

function build(cb) {
    //TODO
    cb();
}

exports.build = build;
exports.default = gulp.series(clean, build, server);