var mqtt = require('mqtt')
  , _ = require('lodash')
  , topics = require('./topic')

var emitter = require('./emitter')

const CONSTANTS = require('./constants')

var client = mqtt.conncet(CONSTANTS.MQTT_BROKER)

client.on('connect', function () {
  client.on('message', function (topic, message) {
    emitter.emit(topic, message)
  })
  _.map(CONSTANTS.MQTT_COMMANDS, function (command) {
    client.subscribe(topics.prefix(command))
  })
})
