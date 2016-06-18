var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

var source = [
    './index*.js',
    './lib/**/*.js',
    './test/unit/*.js',
    '!./node_modules'
];

gulp.task('default', ['lint', 'style'], function () {});

gulp.task('lint', function () {
    gulp.src(source)
        .pipe(jshint())
        .pipe(jshint.reporter());
});

gulp.task('style', function () {
    gulp.src(source)
        .pipe(jscs())
        .pipe(jscs.reporter());
});

gulp.task('watch', function () {
    gulp.watch(source, ['lint', 'style']);
});
