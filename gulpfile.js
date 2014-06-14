var gulp    = require('gulp')
var connect = require('gulp-connect')
var watch   = require('gulp-watch')
var gutil   = require('gulp-util')
var browserify = require('gulp-browserify')

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
      'app/styles/**/*.css',
      'app/scripts/**/*.js',
      'app/images/**/*.*',
    ]
  }).pipe(connect.reload())

  watch({
    glob: [
      'src/js/**/*.js',
    ]
  }, ['browserify'])
})

gulp.task('browserify', function() {
  gulp.src('src/js/application.js')
      .pipe(browserify({
        insertGlobals: true,
        debug: !gulp.env.production,
      }))
      .on('error', function(err) {
        gutil.log(err.message)
      })
      .pipe(gulp.dest('./app/scripts'))
})

gulp.task('default', [
  'connect',
  'watch',
])
