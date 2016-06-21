var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    mocha = require('gulp-mocha'),
    exec = require('child_process').exec;

var source = [
    './index.js',
    './gulpfile.js',
    './lib/*.js',
    './config/*.js',
    './services/*.js',
    './test/unit/*.js',
    '!./node_modules'
];

gulp.task('jshint', function () {
    gulp.src(source)
        .pipe(jshint())
        .pipe(jshint.reporter());
});

gulp.task('jscs', function () {
    gulp.src(source)
        .pipe(jscs())
        .pipe(jscs.reporter());
});


gulp.task('test', function () {
    gulp.src('./test/unit/*.js')
        .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('test-with-coverage', function (done) {
    var cmd = './node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha ./test/unit ' +
              '--report lcovonly -- -R spec && cat ./coverage/lcov.info | ' +
              './node_modules/.bin/coveralls';

    exec(cmd, function (error) {
        if (error) { console.error(error); }
        done();
    });
});

gulp.task('watch', ['lint', 'test'], function () {
    gulp.watch(source, ['lint', 'test']);
});

gulp.task('lint', ['jshint', 'jscs']);
