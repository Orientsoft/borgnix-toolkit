var util = require('util')
  , EventEmitter = require('events').EventEmitter
  , MqttSerial = require('mqtt-serial').SerialPort
  , SerialPort = require('serialport').SerialPort
  // , mqttClient = require('./mqtt-client')
  , butil = require('./util')
  , _ = require('underscore')
  , topic = require('./topic')

const CONSTANTS = require('./constants')
const MQTT_COMMANDS = CONSTANTS.MQTT_COMMANDS

function SerialDebugger(client, portName) {
  EventEmitter.call(this)
  this.mqttSerial = new MqttSerial({
    client: client
  , transmitTopic: topic.prefix(MQTT_COMMANDS.PORT_OUT, portName)
  , receiveTopic: topic.prefix(MQTT_COMMANDS.PORT_IN, portName)
  })
  this.portName = portName
}
util.inherits(SerialDebugger, EventEmitter)

SerialDebugger.prototype.start = function (baudrate, cb) {
  console.log('start transmition', this.portName, baudrate)
  var self = this
  this.sp = new SerialPort(this.portName, {
    baudrate: baudrate
  })

  this.sp.on('open', function () {
    console.log('serial port opened')
    self.mqttSerial.on('data', self.sp.write.bind(self.sp))
    self.sp.on('data', self.mqttSerial.write.bind(self.mqttSerial))
    if (_.isFunction(cb)) cb()
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

SerialDebugger.prototype.startUpload = function (baudrate) {
  var self = this
  this.start(this.portName, baudrate, function () {
    self.reset(function () {
      self.emit('started')
    })
  })
}

SerialDebugger.prototype.stop = function (cb) {
  if (this.sp) this.sp.close(cb)
}

module.exports = SerialDebugger
