var store = require('./store')
  , SerialDebugger = require('./serial-debugger')
  , emitter = require('./emitter')
  , mqtt = require('mqtt')
  , CONSTANTS = require('./constants')
  , _ = require('lodash')
  , config = require('./config')


var MQTT_COMMANDS = CONSTANTS.MQTT_COMMANDS

function setup(payload, cb) {
  if (!store.clients[payload.user])
    store.clients[payload.user] = mqtt.connect(CONSTANTS.MQTT_BROKER, {
      username: config.get('uuid')
    , password: config.get('token')
    })
  if (!store.debuggers[payload.portName])
    store.debuggers[payload.portName] = new SerialDebugger(
      store.clients[payload.user]
    , payload.portName
    )
  if (_.isFunction(cb)) cb()
}

function startDebug(payload) {
  setup(payload, function () {
    store.debuggers[payload.portName].start(parseInt(payload.message.toString()))
  })
}

function stop(payload) {
  try {
    store.debuggers[payload.portName].stop()
  }
  catch (e) {
    console.error(e)
  }
}

function startUpload(payload) {
  setup(payload, function () {
    store.debuggers[payload.portName].startUpload(parseInt(payload.message.toString()))
  })
}

var triggerMap = new Map()

triggerMap.set(MQTT_COMMANDS.DEBUG_START, startDebug)
triggerMap.set(MQTT_COMMANDS.DEBUG_STOP, stop)
triggerMap.set(MQTT_COMMANDS.UPLOAD_START, startUpload)
triggerMap.set(MQTT_COMMANDS.UPLOAD_STOP, stop)

triggerMap.forEach(function (f, command) {
  emitter.on(command, f)
})
