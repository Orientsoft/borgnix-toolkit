var config = require('../config/default.json')
var io = require('socket.io')(config.port)

io.on('connection', function (socket) {
  console.log('connected')
  socket.emit('hello')
})
