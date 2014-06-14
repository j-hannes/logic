var gulp    = require('gulp')
var connect = require('gulp-connect')
var watch   = require('gulp-watch')

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
})

gulp.task('default', [
  'connect',
  'watch',
])
