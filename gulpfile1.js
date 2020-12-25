const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const watchify = require('watchify');
const tsify = require('tsify');
const gUtil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const server = require('browser-sync');
const htmlmin = require('gulp-htmlmin');
const changed = require('gulp-changed');
const rev = require('gulp-rev');

const paths = {
  pages: ['src/**/*.html', 'src/*.html'],
};
const baseDir = 'dist';

const watchedBrowserify = watchify(
  browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {},
  }).plugin(tsify)
);

// 设置服务器
gulp.task('server', () => {
  server.init({
    port: 8082,
    server: {
      baseDir,
      index: 'index.html',
    },
  });
});

// 赋值html
gulp.task('copy-html', function () {
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
});

gulp.task('u_css', () => {
  return gulp
    .src('css/*.css')
    .pipe(changed('./'))
    .pipe(gulp.dest(baseDir + '/css'));
});

// 添加指纹
gulp.task('revision', () => {
  gulp
    .src(['dist/**/*.js', 'dist/**/*.css'])
    .pipe(rev())
    .pipe(gulp.dest('/dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('/dist'));
  gulp.src(['dist/css/font/*']).pipe(gulp.dest('dist/css/font/*'));
  gulp.src(['dist/img/*.{jpg,png,ico,gif}']).pipe(gulp.dest('dist/img'));
});

//替换
gulp.task(
  'replace',
  gulp.series('revision', () => {
    const manifest = gulp.src('./' + 'dist' + '/rev-manifest.json');

    gulp
      .src('*.html')
      .pipe(rev_replace({ manifest: manifest }))
      .pipe(gulp.dest('dist'));
    let zip = require('gulp-zip');
    let date = new Date();
    let file_name = `dist-${date.getHours()}-${date.getDate()}-${date.getMonth() + 1}.zip`;
    console.log(file_name);
    gulp.src('dist/**/*').pipe(zip(file_name)).pipe(gulp.dest('./'));
  })
);

function bundle() {
  return watchedBrowserify
    .plugin(tsify)
    .transform('babelify', {
      presets: ['es2015'],
      extensions: ['.ts'],
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
}

gulp.task('default', gulp.parallel('copy-html', 'u_css', 'revision', 'replace', bundle));
watchedBrowserify.on('update', bundle);
watchedBrowserify.on('log', gUtil.log);
