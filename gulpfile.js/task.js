const gulp = require('gulp');
const changed = require('gulp-changed');
const htmlmin = require('gulp-htmlmin');

const paths = {
  js: ['src/**/*.js', 'src/*.js'],
  pages: ['src/**/*.html', 'src/*.html'],
  css: ['src/css/**/*.css', 'src/css/*.css'],
};
const baseDir = 'dist';

exports.paths = paths;
exports.baseDir = baseDir;

// 赋值html
exports.copyHtml = () => {
  return gulp
    .src(paths.pages)
    .pipe(changed(baseDir))
    .pipe(
      htmlmin({
        collapseWhitespace: false,
        removeComments: true,
      })
    )
    .pipe(gulp.dest(baseDir));
};

// 赋值css
exports.copyCss = () => {
  return gulp.src(paths.css).pipe(changed(baseDir)).pipe(gulp.dest(baseDir));
};
