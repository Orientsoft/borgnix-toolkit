var mqtt = require('mqtt')
  , _ = require('lodash')
  , EventEmitter = require('events').EventEmitter

  , emitter = require('./emitter')
  , config = require('./config')
  , topics = require('./topic')

// setup message callbacks
require('./actions')

const CONSTANTS = require('./constants')

var listener = new EventEmitter()
  , client
  , online = false

listener.start = function (cb) {
  console.log('listener start')
  if (!online) {
    console.log('starting')
    var opts = {
      username: config.get('uuid')
    , password: config.get('token')
    }
    console.log(CONSTANTS.MQTT_BROKER)
    client = mqtt.connect(CONSTANTS.MQTT_BROKER, opts)
    client.on('connect', function () {
      console.log('mqtt client connected')
      client.on('message', function (topic, message) {
        var topicInfo = topics.resolve(topic)
        console.log('received', topic, message, topicInfo)
        topics.setUser(topicInfo.user)
        emitter.emit(topicInfo.topic, {
          message: message
        , user: topicInfo.user
        , portName: topicInfo.portName
        })
      })
      _.map(CONSTANTS.MQTT_COMMANDS, function (command) {
        console.log('sub', topics.wild(command))
        client.subscribe(topics.wild(command))
      })
      // console.log(topics.wild('#'))
      // client.subscribe(topics.wild('#'), function (e) {
      //   console.log(e)
      // })
      if (_.isFunction(cb)) cb()
    })
    client.on('error', function (error) {
      console.log('mqtt error', error)
      client.end()
      if (_.isFunction(cb)) cb(error)
    })
  }
}

listener.stop = function (cb) {
  if (online)
    client.end(function () {
      client = null
      if (_.isFunction(cb)) cb()
    })
  else
    if (_.isFunction(cb)) cb()
}

listener.restart = function (cb) {
  listener.stop(function () {
    listener.start(cb)
  })
}

module.exports = listener
