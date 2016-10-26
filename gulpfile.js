var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence'),
    htmlmin = require('gulp-htmlmin'),
    plumber = require('gulp-plumber'),
    imageMin = require('gulp-imagemin'),
    inlinesource = require('gulp-inline-source'),
    path = require('path'),
    swPrecache = require('sw-precache'),
    package = require('./package.json');

// attach pagespeed_insights gulp tasks
require('./pagespeed_insights');

var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

var PRODUCTION = 'prod';
var DEV = 'dev';
var mode = DEV;

gulp.task('css', function () {
    return gulp.src('src/scss/style.scss')
    .pipe(mode === DEV ? sourcemaps.init() : gutil.noop())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { package : package }))
    .pipe(mode === DEV ? sourcemaps.write() : gutil.noop())
    .pipe(gulp.dest('app/assets/css', { overwrite: true }))
    .pipe(mode === DEV ? browserSync.reload({stream:true}) : gutil.noop());
});

gulp.task('js',function(){
  gulp.src('src/js/scripts.js')
    .pipe(mode === DEV ? sourcemaps.init() : gutil.noop())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    // .pipe(header(banner, { package : package })) // why output this?
    // .pipe(gulp.dest('app/assets/js'))
    .pipe(uglify())
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(mode === DEV ? sourcemaps.write() : gutil.noop())
    .pipe(gulp.dest('app/assets/js', { overwrite: true }))
    .pipe(mode === DEV ? browserSync.reload({stream:true, once: true}) : gutil.noop());
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "docs"
        }
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['build'], function () {
  runSequence('browser-sync');
  gulp.watch("src/scss/*/*.scss", ['refresh-css']);
  gulp.watch("src/js/*.js", ['refresh-js']);
  gulp.watch("app/*.html", ['refresh-html']);
});

gulp.task('refresh-html', function(cb) {
  runSequence('docs', 'optimize-html', 'worker', 'bs-reload', cb);
});

gulp.task('refresh-js', function(cb) {
  runSequence('js', 'docs', 'optimize-html', 'worker', 'bs-reload', cb);
});

gulp.task('refresh-css', function(cb) {
  runSequence('css', 'docs', 'optimize-html', 'worker', 'bs-reload', cb);
});

// builds for production
gulp.task('build', function (cb) {
  mode = PRODUCTION;
  runSequence(['css', 'js'], 'docs', ['optimize-html', 'optimize-images'], 'worker', cb);
});

gulp.task('docs', function() {
  gulp.src([
    'app/*',
    '!app/*.html',
    'app/**/*.css',
    'app/**/*.js',
    'app/**/*.mp4',
    'app/**/*.m4a',
    'app/**/*.webm',
  ])
    .pipe(gulp.dest('docs', { overwrite: true }));
});

gulp.task('optimize-images', function() {
  return gulp.src([
    'app/assets/img/**/*',
  ])
    .pipe(plumber())
    .pipe(imageMin({
      progressive: true,
      multipass: true,
    }))
    .pipe(gulp.dest('docs/assets/img', { overwrite: true }));
});

gulp.task('optimize-html', function() {
  gulp.src('app/**/*.html')
    .pipe(inlinesource())
    .pipe(htmlmin({
      collapseWhitespace: true,
      collapseInlineTagWhitespace: false,
      removeAttributeQuotes: true,
      minifyJS: true,
      minifyURLs: true,
      removeComments: true,
      removeRedundantAttributes: true,
      // removeOptionalTags: true, // AMP does not allow this
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      sortAttributes: true,
      sortClassName: true,
      useShortDoctype: true,
    }))
    .pipe(gulp.dest('docs', { overwrite: true }));
});

gulp.task('worker', ['generate-service-worker'], function() {
  gulp.src('docs/service-worker.js')
    .pipe(mode === DEV ? sourcemaps.init() : gutil.noop())
    .pipe(uglify())
    .pipe(mode === DEV ? sourcemaps.write() : gutil.noop())
    .pipe(gulp.dest('docs', { overwrite: true }))
    .pipe(mode === DEV ? browserSync.reload({stream:true, once: true}) : gutil.noop());
});

gulp.task('generate-service-worker', function(callback) {
  var rootDir = 'docs';

  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    // ALL FILES are immediately cached so let's be judicious on what we ask for
    // no css, it's all inlined
    staticFileGlobs: [rootDir + '/**/*.{js,html,png,jpg,gif,svg,eot,ttf,woff}'],
    stripPrefix: rootDir
  }, callback);
});
