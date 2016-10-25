var gulp = require('gulp');
var ngrok = require('ngrok');
var psi = require('psi');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');

var port = 3000;
var site = '';

gulp.task('ngrok-url', function(cb) {
  return ngrok.connect(port, function (err, url) {
    site = url;
    console.log('serving your tunnel from: ' + site);
    cb();
  });
});

gulp.task('psi-desktop', function (cb) {
  psi.output(site, {
    nokey: 'true',
    strategy: 'desktop',
    threshold: 1,
  }).then(cb, cb);
});

gulp.task('psi-mobile', function (cb) {
  psi.output(site, {
    nokey: 'true',
    strategy: 'mobile',
    threshold: 1,
  }).then(cb, cb);
});

// this is where your server task goes. I'm using browser sync
gulp.task('browser-sync-psi', function() {
  browserSync({
    open: false,
    port: port,
    server: {
      baseDir: 'docs'
    }
  });
});

// psi sequence with 'browser-sync-psi' instead
gulp.task('psi-seq', ['build'], function (cb) {
  return runSequence(
    'browser-sync-psi',
    'ngrok-url',
    'psi-desktop',
    'psi-mobile',
    cb
  );
});

// psi task runs and exits
gulp.task('psi', ['psi-seq'], function() {
  console.log('Woohoo! Check out your page speed scores!');
});
