var gulp    = require('gulp')
var connect = require('gulp-connect')
var watch   = require('gulp-watch')
var gutil   = require('gulp-util')
var source = require('vinyl-source-stream')
var watchify = require('watchify')
var browserify = require('browserify')

var bundler = watchify(browserify('./src/app.js', watchify.args));
bundler.transform('brfs')
       .transform('exposify', {expose: {angular: 'angular'}});

gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true,
  })
})

gulp.task('watch', function() {
  watch({
    glob: [
      'app/index.html',
      'app/styles/main.css',
      'app/scripts/app.js'
    ]
  }).pipe(connect.reload())
})


function bundle() {
  return bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(gulp.dest('./app/scripts'))
}

gulp.task('js', bundle);
bundler.on('update', bundle);

gulp.task('default', [
  'js',
  'connect',
  'watch',
])

