var mqtt = require('mqtt')

var client = mqtt.connect('mqtt://voyager.orientsoft.cn:11883')

client.on('connect', function () {
  console.log('mqtt connected')
})

module.exports = client
