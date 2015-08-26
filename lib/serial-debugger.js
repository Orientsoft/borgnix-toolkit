var util = require('util')
  , EventEmitter = require('events').EventEmitter
  , MqttSerial = require('mqtt-serial').SerialPort
  , SerialPort = require('serialport').SerialPort
  , mqttClient = require('./mqtt-client')
  , butil = require('./util')
  , _ = require('underscore')

function SerialDebugger() {
  EventEmitter.call(this)
  this.mqttSerial = new MqttSerial({
    client: mqttClient
  , transmitTopic: 'debug/out'
  , receiveTopic: 'debug/in'
  })
}
util.inherits(SerialDebugger, EventEmitter)

SerialDebugger.prototype.start = function (portName, baudrate) {
  console.log('start debug', portName, baudrate)
  var self = this
  this.sp = new SerialPort(portName, {
    baudrate: baudrate
  })

  this.sp.on('open', function () {
    console.log('serial port opened')
    self.mqttSerial.on('data', self.sp.write.bind(self.sp))
    self.sp.on('data', self.mqttSerial.write.bind(self.mqttSerial))
  })
}

SerialDebugger.prototype.reset = function (cb) {
  var self = this
  self.sp.set({rts: true, dtr: true}, function (err1) {
    if (err1) butil.printErrorStack(err1)
    else
      setTimeout(function () {
        self.sp.set({rts: false, dtr: false}, function (err2) {
          if (_.isFunction(cb)) cb(err2)
        })
      }, 100)
  })
}

module.exports = SerialDebugger
