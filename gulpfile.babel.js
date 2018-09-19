import gulp from 'gulp';
import util from 'gulp-util';
import concat from 'gulp-concat';
import header from 'gulp-header';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import addsrc from 'gulp-add-src';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import child from 'child_process';
import hygienist from 'hygienist-middleware';
import del from 'del';
import fs from 'fs';

const parsed = JSON.parse(fs.readFileSync('./package.json'));
const siteRoot = '_site';
const jekyllLogger = buffer => {
  buffer
    .toString()
    .split(/\n/)
    .forEach(message => util.log(`Jekyll: ${message}`));
};

const banner = `/*! ultimateangular.com | (c) ${new Date().getFullYear()} Ultimate Angular Limited */\n`;

const paths = {
  scripts: '_scripts/*.js',
  libs: [],
  dist: 'assets/js/',
  scss: 'assets/css/source/*.scss',
  css: 'assets/css/',
};

browserSync.create();

gulp.task('clean', fn => del([paths.dist, siteRoot], fn));

gulp.task('scripts', ['clean'], () => {
  return gulp
    .src(paths.scripts)
    .pipe(plumber())
    .pipe(babel())
    .pipe(addsrc.prepend(paths.libs))
    .pipe(concat('bundle.min.js'))
    .pipe(uglify())
    .pipe(
      header(banner, {
        parsed,
      })
    )
    .pipe(gulp.dest(paths.dist));
});

const sassConfig = {
  errLogToConsole: true,
  outputStyle: 'compressed',
};

gulp.task('css', () => {
  return gulp
    .src(paths.scss)
    .pipe(sass(sassConfig).on('error', sass.logError))
    .pipe(
      autoprefixer({
        browsers: ['last 10 versions'],
      })
    )
    .pipe(gulp.dest(paths.css));
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', [
    'serve',
    '--watch',
    '--incremental',
    '--drafts',
  ]);
  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('jekyll-ci-build', () => {
  const jekyll = child.spawn('jekyll', ['build']);
  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('ci-build', ['scripts', 'jekyll-ci-build']);

gulp.task('serve', () => {
  browserSync.init({
    files: [`${siteRoot}/**`],
    port: 4000,
    server: {
      baseDir: siteRoot,
      middleware: hygienist(siteRoot),
    },
    open: false,
  });
});

gulp.task('watch', () => {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(
    ['assets/css/source/**/*.scss', 'assets/css/source/*.scss'],
    ['css']
  );
});

gulp.task('default', ['scripts', 'serve', 'jekyll', 'watch']);
