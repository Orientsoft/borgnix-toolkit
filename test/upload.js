var SerialDebugger = require('../lib/serial-debugger')
  , mqtt = require('mqtt')
  , MqttSerial = require('mqtt-serial').SerialPort

// var mqttClient = mqtt.connect('mqtt://voyager.orientsoft.cn:11883')
var mqttClient = mqtt.connect(
  'mqtt://z.borgnix.com:1883'
, { username: '48ac25e0-1595-11e5-85e7-fb8c26f6437d'
  , password: 'e29450986df2d1c6318656c52be7a96cc3da6b66'
  }
)
  , sd = new SerialDebugger(mqttClient)

mqttClient.on('error', function (err) {
  console.log(err)
})
var mqttSerial = new MqttSerial({
  client: mqttClient
, transmitTopic: 'upload/in'
, receiveTopic: 'upload/out'
})

mqttClient.on('connect', function () {
  console.log('test mqtt connected')
  // sd.start('/dev/cu.SLAB_USBtoUART', 19200)
  // sd.start('/dev/cu.usbmodem1411', 115200)
  mqttSerial.on('data', function (data) {
    console.log(data.toString())
  })

  mqttClient.on('message', function (topic) {
    if (topic === 'upload/start') {
      console.log('start uploading')
      sd.startUpload('/dev/cu.usbmodem1411', 115200)
      sd.on('started', function () {
        mqttClient.publish('upload/ready')
      })
    }

    if (topic === 'upload/finished') {
      console.log('upload finished')
      sd.stop()
    }
  })
  mqttClient.subscribe('upload/start')
  mqttClient.subscribe('upload/finished')
})
