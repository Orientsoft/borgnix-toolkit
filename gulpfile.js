var gulp = require('gulp')
  , NwBuilder = require('node-webkit-builder')
  , os = require('os')
  , shell = require('gulp-shell')
  , _ = require('underscore')
  , del = require('del')
  , minimist = require('minimist')

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

gulp.task('default', function () {
  console.log(argv);
})
