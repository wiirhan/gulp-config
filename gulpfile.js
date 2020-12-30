//gulpfile.js
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rev = require('gulp-revm');
var revCollector = require('gulp-revm-collector');

//gulpfile.js
var PATH_SRC_HTML = ['src/**/*.html', 'src/*.html'];
var PATH_DES_HTML = 'dist/';
var PATH_REV_JSON = 'rev/**/*.json';
var PATH_SRC_JS = ['src/**/*.js', 'src/*.js'];
var PATH_SRC_CSS = ['src/**/*.css', 'src/*.css'];
var BASIC_DIR = 'dist';
var BUILD_DIR = 'build';

//gulpfile.js
/*----------javascript MD5 version process----------*/
gulp.task('jsMin', function () {
  return gulp
    .src(PATH_SRC_JS)
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest(BUILD_DIR))
    .pipe(rev.manifest())
    .pipe(gulp.dest(BASIC_DIR));
});

/*----------reversion Javascript deps on task[jsMin]----------*/
gulp.task(
  'rev_js',
  gulp.series('jsMin', function (cb) {
    gulp
      .src([PATH_REV_JSON, ...PATH_SRC_HTML])
      .pipe(
        revCollector({
          replaceReved: true,
        })
      )
      .pipe(gulp.dest(PATH_DES_HTML));
    cb();
  })
);

/*----------css MD5 version process----------*/
gulp.task('cssMin', function () {
  return gulp
    .src(PATH_SRC_CSS)
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest(BUILD_DIR))
    .pipe(rev.manifest())
    .pipe(gulp.dest(BASIC_DIR));
});

/*----------reversion css deps on task[cssMin]----------*/
gulp.task(
  'rev_css',
  gulp.series('cssMin', function (cb) {
    gulp
      .src([PATH_REV_JSON, ...PATH_SRC_HTML])
      .pipe(
        revCollector({
          replaceReved: true,
        })
      )
      .pipe(gulp.dest(PATH_DES_HTML));
    cb();
  })
);

/*----------reversion html pages----------*/
gulp.task('rev_html', function (cb) {
  gulp
    .src([PATH_REV_JSON, ...PATH_SRC_HTML])
    .pipe(
      revCollector({
        replaceReved: true,
      })
    )
    .pipe(gulp.dest(PATH_DES_HTML));
  cb();
});

//gulpfile.js
gulp.task('watchChange', function () {
  console.log('watcher has started');
  gulp.watch(PATH_SRC_JS, gulp.series('rev_js'));
  gulp.watch(PATH_SRC_CSS, gulp.series('rev_css'));
  gulp.watch(PATH_SRC_HTML, gulp.series('rev_html'));
});

// build
gulp.task('build', gulp.parallel('rev_js', 'rev_html'));
