var SerialPort = require('serialport')
  // , fs = require('fs')
  // , intelHex = require('intel-hex')
  // , Stk500 = require('stk500')
  , _ = require('underscore')
  , request = require('request')
  , url = require('url')
  // , BAC = require('arduino-compiler/client-node')
  // , borgnixJar = require('./cookie-jar')

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

, login: function (uuid, token, cb) {
    // var form = {form: {userName: uuid, userPassword: token}}
    var reqParam = {
      url: url.resolve(this._host, '/api/v1/login')
    , form: {userName: uuid, userPassword: token}
    , jar: this._jar
    }
    request.post(reqParam, function (e, r, b) {
      try {
        if (_.isString(b)) b = JSON.parse(b)
        if (_.isFunction(cb)) cb(e, b)
      } catch (err) {
        if (_.isFunction(cb)) cb(err)
      }
    })
  }

, setHost: function (host) {
    this._host = host
  }

, setCookieJar: function (jar) {
    this._jar = jar
  }

, printErrorStack: function (err) {
    if (err) console.log(err.stack || err)
  }
}

module.exports = borgutil
