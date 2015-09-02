var gulp = require('gulp')
  , NwBuilder = require('node-webkit-builder')
  , os = require('os')
  , shell = require('gulp-shell')
  , _ = require('underscore')
  , del = require('del')
  , minimist = require('minimist')
  , babel = require('gulp-babel')
  // , watch = require('gulp-watch')

  , browserify = require('browserify')
  , babelify = require('babelify')
  , watchify = require('watchify')
  , source = require('vinyl-source-stream')
  , concat = require('gulp-concat')

const NW_VERSION = '0.12.2'

function getPlatform () {
  var arch = (os.arch().indexOf('64') != -1 ? '64' : '32')
  var platform = os.platform()
  if (platform.indexOf('darwin') != -1) return 'osx' + arch
  if (platform.indexOf('win') != -1) return 'win' + arch
  return 'linux' + arch
}

function printErrorStack(err) {
  if (err) console.log(err.stack || err)
}

var argv = minimist(process.argv.slice(2))

var isWin = /^win/.test(process.platform)
var goodSlash = isWin ? '\\' : '/'
var badSlash = isWin ? /\//g : /\\/g

gulp.task('install', ['node-rebuild', 'vendor'])

var flags = ''
if (argv.a) flags += ' --target_arch=' + argv.a
if (argv.p) flags += ' --target_platform=' + argv.p
if (argv.d) serialportDir = 'node_modules/serialport'
else serialportDir = 'temp/node_modules/serialport'

gulp.task('node-rebuild', shell.task([
  'node-pre-gyp rebuild --runtime=node-webkit --target=' + NW_VERSION + flags
], {cwd: serialportDir}))

gulp.task('vendor', function () {
  gulp.src(['node_modules/bootstrap/dist/**'])
      .pipe(gulp.dest('vendor/bootstrap'))

  gulp.src(['node_modules/material-design-icons/iconfont/**'])
      .pipe(gulp.dest('vendor/material-design-icons/iconfont'))
})

gulp.task('prebuild', function () {
  // copy production node dependencies
  var setting = require('./package.json')
    , exclude = ['material-design-icons', 'bootstrap']
    , deps = _.keys(setting.dependencies).filter(function (dep) {
        return !_.contains(exclude, dep)
      })
    , include = '*(' + deps.join('|') + ')'
  gulp.src('./node_modules/'+include+'/**')
      .on('error', printErrorStack)
      .pipe(gulp.dest('temp/node_modules'))

  // copy needed folders
  var folders = [ 'config', 'css', 'convert', 'vendor', 'hex']
  gulp.src('./*('+folders.join('|')+')/**')
      .on('error', printErrorStack)
      .pipe(gulp.dest('temp'))

  // copy needed files in root
  var files = [ 'new.html', 'package.json', 'LICENSE']
  gulp.src('./*(' + files.join('|') + ')')
      .on('error', printErrorStack)
      .pipe(gulp.dest('temp'))
})

gulp.task('clean', function () {
  del(['build', 'temp'])
})

gulp.task('build', function () {
  var option = {
    files: './temp/**'
  , version: NW_VERSION
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
  , version: NW_VERSION
  , platforms: [getPlatform()]
  })

  nw.run(function (err) {
    if (err) console.log(err)
    else console.log('done')
  })
})

gulp.task('watch', function () {
  gulp.watch('app/**/*.js', ['es6'])
})

gulp.task('es6', function () {
  gulp.src('app/**/*.js')
      .pipe(babel().on('error', printErrorStack))
      .pipe(gulp.dest('convert'))
      .on('error', printErrorStack)
})

gulp.task('default', function () {
  console.log(argv);
})
