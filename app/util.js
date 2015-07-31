var SerialPort = require('serialport')
  , fs = require('fs')
  , intelHex = require('intel-hex')
  , Stk500 = require('stk500')
  , _ = require('underscore')
  , request = require('request')
  , url = require('url')


var borgutil = {
  getPorts: function (cb) {
    SerialPort.list(function (err, ports) {
      if (err) borgutil.printErrorStack(err)
      if (_.isFunction(cb)) cb(ports)
    })
  }

, resetSerialPort: function (port, cb) {
    port.set({rts: true, dtr: true}, function (err1) {
      if (err1) borgutil.printErrorStack(err1)
      else
        setTimeout(function () {
          port.set({rts: false, dtr: false}, function (err2) {
            if (_.isFunction(cb)) cb(err2)
          })
        }, 100)
    })
  }

, uploadHex: function (port, filename, board, cb) {
    try {
      var data = fs.readFileSync(filename, { encoding: 'utf8' })
        , hex = intelHex.parse(data).data

      var uploadPort = new SerialPort.SerialPort(port, {
        baudrate: board.baud
      })

      uploadPort.on('open', function () {
        borgutil.resetSerialPort(uploadPort, function () {
          Stk500.bootload(uploadPort, hex, board, function(err1){
            if (err1) {
              borgutil.printErrorStack(err1)
              if (_.isFunction(cb)) cb(err1)
            }
            else
              uploadPort.close(function (err2) {
                if (err2) console.log(err2)
                else console.log('upload finish')
                if (_.isFunction(cb)) cb(err2)
              })
          })
        })
      })
    }
    catch (e) {
      borgutil.printErrorStack(e)
      if (_.isFunction(cb)) cb(e)
    }
  }
, login: function (uuid, token, cb) {
    var form = {form: {userName: uuid, userPassword: token}}
    request.post(url.resolve(this._host, '/api/v1/login'), form, (e, r, b) => {
      if (_.isFunction(cb)) cb(e, b)
    })
  }
, setHost: function (host) {
    this._host = host
  }
, printErrorStack: function (err) {
    if (err) console.log(err.stack || err)
  }
}

export default borgutil
