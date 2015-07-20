var gulp = require('gulp')
  , NwBuilder = require('node-webkit-builder')
  , os = require('os')
  , shell = require('gulp-shell')
  , _ = require('underscore')
  , del = require('del')
  , minimist = require('minimist')
  , babel = require('gulp-babel')
  , watch = require('gulp-watch')

  , browserify = require('browserify')
  , babelify = require('babelify')
  , watchify = require('watchify')
  , source = require('vinyl-source-stream')
  , concat = require('gulp-concat')

function getPlatform () {
  var arch = (os.arch().indexOf('64') != -1 ? '64' : '32')
  var platform = os.platform()
  if (platform.indexOf('darwin') != -1) return 'osx' + arch
  if (platform.indexOf('win') != -1) return 'win' + arch
  return 'linux' + arch
}

var argv = minimist(process.argv.slice(2))

var isWin = /^win/.test(process.platform)
var goodSlash = isWin ? '\\' : '/'
var badSlash = isWin ? /\//g : /\\/g

gulp.task('install', ['node-rebuild', 'bower-install'])

var flags = ''
if (argv.a) flags += ' --target_arch=' + argv.a
if (argv.p) flags += ' --target_platform=' + argv.p
if (argv.d) serialportDir = 'node_modules/serialport'
else serialportDir = 'temp/node_modules/serialport'
gulp.task('node-rebuild', shell.task([
  'node-pre-gyp rebuild --runtime=node-webkit --target=0.12.2' + flags
], {cwd: serialportDir}))

gulp.task('bower-install', shell.task([
  'node_modules/.bin/bower install'.replace(badSlash, goodSlash)
, 'node_modules/.bin/bower-installer'.replace(badSlash, goodSlash)
]))

gulp.task('prebuild', function () {
  // copy production node dependencies
  var setting = require('./package.json')
    , deps = '*(' + _.keys(setting.dependencies).join('|') + ')'
  gulp.src('./node_modules/'+deps+'/**')
      .pipe(gulp.dest('temp/node_modules'))

  // copy needed folders
  var folders = [ 'config', 'css', 'js', 'node', 'vendor', 'hex']
  gulp.src('./*('+folders.join('|')+')/**')
      .pipe(gulp.dest('temp'))

  // copy needed files in root
  var files = [ 'index.html', 'package.json', 'LICENSE']
  gulp.src('./*(' + files.join('|') + ')')
      .pipe(gulp.dest('temp'))
})

gulp.task('clean', function () {
  del(['build', 'temp'])
})

gulp.task('build', function () {
  var option = {
    files: './temp/**'
  , version: '0.12.2'
  }

  if (argv.p) {
    option.platforms = [argv.p]
  }
  else {
    option.platforms = [getPlatform()]
  }

  var nw = new NwBuilder(option)

  nw.build(function (err) {
    if (err) console.log(err)
    else console.log('done')
  })
})

gulp.task('run', function () {
  var nw = new NwBuilder({
    files: './**/**'
  , platforms: [getPlatform()]
  })

  nw.run(function (err) {
    if (err) console.log(err)
    else console.log('done')
  })
})

gulp.task('es6', function () {
  watch('app/**/*.js', function () {
    console.log('file changed')
    gulp.src('app/**/*.js')
        .pipe(babel().on('error', function (err) {
          console.error(err)
        }))
        .pipe(gulp.dest('convert'))
  })
    .on('error', function (err) {
      console.error(err)
    })
})

gulp.task('browserify', function () {
  var bundler = browserify({
    entries: ['./app/main.js']
  , transform: [babelify]
  , debug: true
  , cache: {}
  , packageCache: {}
  , fullPaths: true
  })

  var watcher = watchify(bundler)

  return watcher
    .on('update', function () { // When any files update
        var updateStart = Date.now()
        console.log('Updating!')
        watcher.bundle()// Create new bundle that uses the cache for high performance
        .on('error', function (err) {
          console.error(err.stack)
        })
        .pipe(source('main.js'))
    // This is where you add uglifying etc.
        .pipe(gulp.dest('convert'))
        console.log('Updated!', (Date.now() - updateStart) + 'ms')
    })
    .bundle() // Create the initial bundle when starting the task
    .on('error', function (err) {
      console.error(err.stack || err)
    })
    .pipe(source('main.js'))
    .pipe(gulp.dest('convert'))
})

gulp.task('default', function () {
  console.log(argv);
})
