//gulpfile.js
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rev = require('gulp-revm');
var revCollector = require('gulp-revm-collector');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

//gulpfile.js
var PATH_SRC_HTML = ['src/**/*.html', 'src/*.html'];
var PATH_DIST_HTML = ['dist/**/*.html', 'dist/*.html'];
var PATH_DES_HTML = 'dist/';
var PATH_REV_JSON = 'rev/**/*.json';
var PATH_SRC_JS = ['dist/**/*.js', 'dist/*.js'];
var PATH_SRC_CSS = ['dist/**/*.css', 'dist/*.css'];
var BASIC_DIR = 'dist';
var BUILD_DIR = 'build';

/*-------------ts转js------------------*/
gulp.task('ts-js', function () {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest('dist/js'));
});

gulp.task('copy-html', function () {
  return gulp.src(PATH_SRC_HTML).pipe(gulp.dest('dist'));
});

gulp.task('copy-css', function () {
  return gulp.src(PATH_SRC_CSS).pipe(gulp.dest('dist/css'));
});

/*-------------ts转js------------------*/

/*-------------混淆------------------*/
gulp.task('js-min', function () {
  return gulp.src(PATH_SRC_JS).pipe(uglify()).pipe(rev()).pipe(rev.manifest()).pipe(gulp.dest('dist/js'));
});
gulp.task(
  'rev-js',
  gulp.series('js-min', function (cb) {
    gulp
      .src([PATH_REV_JSON, ...PATH_SRC_HTML])
      .pipe(
        revCollector({
          replaceReved: true,
        })
      )
      .pipe(gulp.dest(PATH_SRC_HTML));
    cb();
  })
);

gulp.task('rev-html', function (cb) {
  gulp
    .src([PATH_REV_JSON, ...PATH_SRC_HTML])
    .pipe(
      revCollector({
        replaceReved: true,
      })
    )
    .pipe(gulp.dest(PATH_DIST_HTML));
  cb();
});
/*-------------混淆------------------*/

gulp.task('default', gulp.series('ts-js', 'js-min', 'rev-html'));
