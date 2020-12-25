const { task, parallel } = require('gulp');
const gulp = require('gulp');
const browserify = require('browserify');
const watchify = require('watchify');
const tsify = require('tsify');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const { copyHtml, copyCss, paths } = require('./task');

const watchedBrowserify = watchify(
  browserify({
    basedir: '.',
    debug: true,
    cache: {},
    packageCache: {},
  }).plugin(tsify)
);

function bundle() {
  return watchedBrowserify
    .plugin(tsify)
    .transform('babelify', {
      presets: ['es2015'],
      extensions: ['.ts'],
    })
    .bundle()
    .pipe(source(paths.js))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
}

task('default', parallel(copyHtml, copyCss, bundle));
