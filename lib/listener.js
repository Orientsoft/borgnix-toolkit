var mqtt = require('mqtt')

var emitter = require('./emitter')

const CONSTANTS = require('./constants')

mqtt.conncet(CONSTANTS.MQTT_BROKER)

mqtt.on('connect', function () {
  mqtt.on('message', function (topic, message) {
    emitter.emit(topic, message)
  })
})
