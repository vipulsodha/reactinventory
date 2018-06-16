var gulp = require('gulp');
// var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var config = require('./config.js');
var through2 = require('through2');
var browserify = require('browserify');
var livereload = require('gulp-livereload');

var uglify = require('gulp-uglify');

function browserified() {
    return through2.obj(function (file, enc, next) {
        browserify(file.path, { debug: false /* process.env.NODE_ENV === 'development' */ })
            .transform('babelify', { presets: ['es2015', 'react', 'stage-2'], compact: false })
            .bundle(function (err, res) {
                if (err) { return next(err); }

                file.contents = res;
                next(null, file);
            });
    });
}

// var regexToken = /\${([^}]+)}/g;
// function replaceTokens(match, p) {
//     return typeof config[p] === 'undefined' ? match : config[p];
// }

gulp.task('browserify', function() {
    return gulp.src('src/js/main.js')
      .pipe(browserified())
      .pipe(concat('main.js'))
        // .pipe(uglify())
      .pipe(gulp.dest('dist/js/'))
      // .pipe(livereload());
});

gulp.task('copy', function() {
    return gulp.src('src/*.html')
      .pipe(gulp.dest('dist'))
      // .pipe(livereload());
});
gulp.task('copyData', function() {
    return gulp.src('src/data/*.csv')
      .pipe(gulp.dest('dist/data/'))
      // .pipe(livereload());
});

gulp.task('copyCss', function() {
    return gulp.src('src/css/*.css')
      .pipe(gulp.dest('dist/css/'))
      // .pipe(livereload());
});

gulp.task('copyLib', function() {
    return gulp.src('src/lib/*.js')
      .pipe(gulp.dest('dist/lib/'))
      // .pipe(livereload());
});

gulp.task('copyFont', function () {
    return gulp.src('src/fonts/*.*')
        .pipe(gulp.dest('dist/fonts/'))
});

gulp.task('copyImg', function () {
    return gulp.src('src/img/*.*')
        .pipe(gulp.dest('dist/img/'))
});


gulp.task('default',['browserify', 'copy', 'copyCss'], function () {
    return gulp.src('dist/**/*.{js,css,html,svg,json,txt}')
        // .pipe(replace(regexToken, replaceTokens))
        .pipe(gulp.dest('dist/'))
        // .pipe(livereload());
});


gulp.task('prod',['browserify', 'copy', 'copyCss', 'copyLib', 'copyData', 'copyFont', 'copyImg'], function () {
    return gulp.src('dist/**/*.{js,css,html,svg,json,txt}')
        // .pipe(replace(regexToken, replaceTokens))
        .pipe(gulp.dest('../../task2/WebContent/'))
        // .pipe(livereload());
});

gulp.task('localProd',['browserify', 'copy', 'copyCss', 'copyLib', 'copyData', 'copyFont', 'copyImg'], function () {
    return gulp.src('dist/**/*.{js,css,html,svg,json,txt}')
    // .pipe(replace(regexToken, replaceTokens))
        .pipe(gulp.dest('dist/'))
    // .pipe(livereload());
});

gulp.task('watch', function() {
    // livereload.listen();
    gulp.watch('src/**/*.*', ['default']);
});

