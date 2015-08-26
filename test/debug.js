var SerialDebugger = require('../lib/serial-debugger')
  , mqtt = require('mqtt')
  , MqttSerial = require('mqtt-serial').SerialPort

var mqttClient = mqtt.connect('mqtt://voyager.orientsoft.cn:11883')
  , sd = new SerialDebugger()

var mqttSerial = new MqttSerial({
  client: mqttClient
, transmitTopic: 'debug/in'
, receiveTopic: 'debug/out'
})

mqttClient.on('connect', function () {
  console.log('test mqtt connected')
  sd.start('/dev/cu.SLAB_USBtoUART', 19200)
  mqttSerial.on('data', function (data) {
    console.log(data.toString())
  })
})
