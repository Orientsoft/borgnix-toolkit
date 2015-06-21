var gulp = require('gulp')
  , NwBuilder = require('node-webkit-builder')
  , os = require('os')
  , shell = require('gulp-shell')

function getPlatform () {
  var arch = (os.arch().indexOf('64') != -1 ? '64' : '32')
  var platform = os.platform()
  if (platform.indexOf('darwin') != -1) return 'osx' + arch
  if (platform.indexOf('win') != -1) return 'win' + arch
  return 'linux' + arch
}

gulp.task('install', ['node-rebuild', 'bower-install'])

gulp.task('node-rebuild', shell.task([
  'node-pre-gyp rebuild --runtime=node-webkit --target=0.12.2'
], {cwd: 'node_modules/serialport'}))

gulp.task('bower-install', shell.task([
  'node_modules/.bin/bower install'
, 'node_modules/.bin/bower-installer'
]))

gulp.task('build', function () {
  var nw = new NwBuilder({
    files: './**/**'
  , platforms: [getPlatform()]
  , version: '0.12.2'
  })

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
