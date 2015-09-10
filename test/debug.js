var SerialDebugger = require('../lib/serial-debugger')
  , mqtt = require('mqtt')
  , MqttSerial = require('mqtt-serial').SerialPort
  , topics = require('../lib/topic')

//   , butil = require('../lib/util')
//
// butil.setHost('http://z.borgnix.com')
// butil.login('huangyuelong@orientsoft.cn', 'welcome3', function (e, b) {
//   console.log(e, b)
// })

const CONSTANTS = require('../lib/constants')

topics.setUser('48ac25e0-1595-11e5-85e7-fb8c26f6437d')

// var mqttClient = mqtt.connect('mqtt://voyager.orientsoft.cn:11883')
var mqttClient = mqtt.connect(
  'mqtt://z.borgnix.com:1883'
, { username: '48ac25e0-1595-11e5-85e7-fb8c26f6437d'
  , password: 'e29450986df2d1c6318656c52be7a96cc3da6b66'
  }
)
  , portName = '/dev/cu.usbmodem1411'
  // , portName = '/dev/cu.SLAB_USBtoUART'
  // , sd = new SerialDebugger(mqttClient, portName)

mqttClient.on('error', function (err) {
  console.log(err)
})

var receiver = mqtt.connect(
  'mqtt://z.borgnix.com:1883'
, { username: '48ac25e0-1595-11e5-85e7-fb8c26f6437d'
  , password: 'e29450986df2d1c6318656c52be7a96cc3da6b66'
  }
)

var mqttSerial = new MqttSerial({
  client: receiver
, transmitTopic: topics.prefix(CONSTANTS.MQTT_COMMANDS.PORT_IN, portName)
, receiveTopic: topics.prefix(CONSTANTS.MQTT_COMMANDS.PORT_OUT, portName)
})

console.log(topics.prefix(CONSTANTS.MQTT_COMMANDS.DEBUG_START, portName))
mqttClient.publish(topics.prefix(CONSTANTS.MQTT_COMMANDS.DEBUG_START, portName), '115200')

mqttClient.on('connect', function () {
  console.log('test mqtt connected')
  // sd.start('/dev/cu.SLAB_USBtoUART', 19200)
  // sd.start(115200)
  mqttSerial.on('data', function (data) {
    console.log(data.toString())
  })
})
