var mqtt = require('mqtt')

const CONSTANTS = require('../lib/constants')

var mqttCommands = [
  'upload/start'
, 'upload/ready'
, 'upload/stop'
, 'debug/start'
, 'debug/stop'
]

var client = mqtt.connect(CONSTANTS.MQTT_BROKER)

client.on('connect', function () {
  console.log('mqtt connected')
  mqttCommands.map(function (topic) {
    client.subscribe(topic)
  })
})
