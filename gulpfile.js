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
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('app/assets/js'))
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
            baseDir: "app"
        }
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['css', 'js', 'browser-sync'], function () {
    gulp.watch("src/scss/*/*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("app/*.html", ['bs-reload']);
});

// builds for production
gulp.task('build', function (cb) {
  mode = PRODUCTION;
  runSequence(['css', 'js'], 'docs', ['optimize-html', 'optimize-images'], cb);
});

gulp.task('docs', function() {
  gulp.src([
    'app/*',
    '!app/*.html',
    'app/**/*.css',
    'app/**/*.js',
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
})

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
      removeOptionalTags: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      sortAttributes: true,
      sortClassName: true,
      useShortDoctype: true,
    }))
    .pipe(gulp.dest('docs', { overwrite: true }));
})
