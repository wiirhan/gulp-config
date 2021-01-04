//gulpfile.js
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rev = require('gulp-revm');
const revCollector = require('gulp-revm-collector');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const clean = require('gulp-clean');

// src 源码目录
const PATH_SRC_HTML = ['src/**/*.html', 'src/*.html'];
const PATH_SRC_CSS = ['src/**/*.css', 'src/*.css'];
const PATH_SRC_IMG = ['src/**/*.svg', 'src/**/*.png', 'src/**/*.jpg', 'src/**/*.svg', 'src/**/*.ttf', 'src/**/*.woff'];
const PATH_SRC_JSON = ['src/**/*.json'];

// build 发生产的代码
const BUILD_DIR = 'build';
const DIST_DIR = 'dist';
const PATH_BUILD_JS = ['build/**/*.js', 'build/*.js'];
const PATH_REV_JSON = ['dist/**/*.json', 'dist/*.json'];
// 特殊的js，需要拷贝到最外层
const STATIC_JS = 'build/js/static/**/*.js';

/*-------------ts转js------------------*/
gulp.task('ts-js', function () {
  return tsProject
    .src()
    .pipe(tsProject())
    .on('error', function () {
      console.log('error');
    })
    .js.pipe(gulp.dest(`${BUILD_DIR}/js`));
});
/*-------------ts转js------------------*/

/*-------------混淆------------------*/
gulp.task('js-min', function () {
  return gulp
    .src(PATH_BUILD_JS)
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest(`${BUILD_DIR}`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(`${DIST_DIR}/js`));
});

gulp.task(
  'rev-js',
  gulp.series('js-min', function (cb) {
    gulp
      .src([...PATH_REV_JSON, ...PATH_SRC_HTML])
      .pipe(
        revCollector({
          replaceReved: true,
        })
      )
      .pipe(gulp.dest(BUILD_DIR));
    cb();
  })
);

gulp.task('css-min', function () {
  return gulp
    .src(PATH_SRC_CSS)
    .pipe(rev())
    .pipe(gulp.dest(`${BUILD_DIR}`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(`${DIST_DIR}/css`));
});

gulp.task(
  'rev-css',
  gulp.series('css-min', function (cb) {
    gulp
      .src([...PATH_REV_JSON, ...PATH_SRC_HTML])
      .pipe(
        revCollector({
          replaceReved: true,
        })
      )
      .pipe(gulp.dest(BUILD_DIR));
    cb();
  })
);

gulp.task('rev-other', function (cb) {
  gulp.src([...PATH_SRC_IMG, ...PATH_SRC_JSON]).pipe(gulp.dest(BUILD_DIR));
  cb();
});

gulp.task('rev-static', function (cb) {
  gulp.src(STATIC_JS).pipe(gulp.dest(`${BUILD_DIR}/static`));
  cb();
});

gulp.task('rev-plugins', function (cb) {
  gulp.src(['src/js/plugins/**/*.*', 'src/js/plugins/*.*']).pipe(gulp.dest(`${BUILD_DIR}/js/plugins`));
  gulp.src(['src/js/global_assets/**/*.*', 'src/js/global_assets/*.*']).pipe(gulp.dest(`${BUILD_DIR}/js/global_assets`));
  gulp.src( 'src/config/*.js').pipe(gulp.dest(`${BUILD_DIR}/config`));
  gulp.src( 'src/js/common/*.*').pipe(gulp.dest(`${BUILD_DIR}/js/common`));
  cb();
});

gulp.task('rev-html', function (cb) {
  gulp
    .src([...PATH_REV_JSON, ...PATH_SRC_HTML])
    .pipe(
      revCollector({
        replaceReved: true,
      })
    )
    .pipe(gulp.dest(BUILD_DIR));
  cb();
});
/*-------------混淆------------------*/

gulp.task(
  'build',
  gulp.series(function () {
    return gulp.src(BUILD_DIR, { read: false, allowEmpty: true }).pipe(clean());
  }, gulp.series('ts-js', 'rev-js', 'rev-css', 'rev-other', 'rev-html', 'rev-static', 'rev-plugins'))
);

gulp.task('watch', function () {
  console.log('watcher has started');
  gulp.watch(['src/js/**/*.ts', 'src/js/*.ts', 'src/static/**/*.ts'], gulp.series('ts-js', 'rev-js', 'rev-static'));
  gulp.watch(PATH_SRC_CSS, gulp.series('rev-css'));
  gulp.watch(PATH_SRC_HTML, gulp.series('rev-html'));
});

gulp.task('del-js', function () {
  return gulp.src(['src/js/**/*.js', 'src/js/*.js'], { read: false }).pipe(clean());
});
