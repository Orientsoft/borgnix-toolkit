var gulp = require('gulp')
  , os = require('os')
  , shell = require('gulp-shell')
  , _ = require('underscore')
  , del = require('del')
  , minimist = require('minimist')
  , babel = require('gulp-babel')
  , fs = require('fs')
  , path = require('path')
  // , watch = require('gulp-watch')

  , browserify = require('browserify')
  , babelify = require('babelify')
  , watchify = require('watchify')
  , source = require('vinyl-source-stream')

function printErrorStack(err) {
  if (err) console.log(err.stack || err)
}

var argv = minimist(process.argv.slice(2))

gulp.task('build', function () {
  var enclose = require('enclose').exec
  if (!fs.existsSync(path.join(__dirname, 'build')))
    fs.mkdirSync(path.join(__dirname, 'build'))
  var flags = [
    './bin/www'
  , '-o'
  , './build/app'
  ]
  if (argv.a === 'x64') flag.push('--x64')
  enclose(flags)
})

gulp.task('watch', function () {
  var file = 'main.js'
  var bundler = browserify({
    entries: ['./app-admin/' + file]
  , transform: [babelify]
  , debug: true
  , cache: {}
  , packageCache: {}
  // , fullPaths: true
  })

  var watcher = watchify(bundler)

  watcher.build = function () {
    console.log('start build')
    watcher.bundle()
           .on('error', printErrorStack)
           .pipe(source(file))
          //  .pipe(streamify(uglify.js()))
           .pipe(gulp.dest('./public/js'))
  }

  watcher.on('error', printErrorStack)
         .on('update', watcher.build)
         .on('time', function (time) {
            console.log('building took:', time)
          })

  watcher.build()

  // gulp.watch('./less/**.less', ['less'])
  // gulp.start('less')
})

gulp.task('default', function () {
  console.log(argv)
})
