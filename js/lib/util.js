var SerialPort = requireNode('serialport')
  , fs = requireNode('fs')
  , intel_hex = requireNode('intel-hex')
  , Stk500 = requireNode('stk500')

var borgutil = {
  getPorts: function (cb) {
    SerialPort.list(function (err, ports) {
      if (_.isFunction(cb)) cb(ports)
    })
  }

, resetSerialPort: function (port, cb) {
    port.set({rts: true, dtr: true}, function (err) {
      setTimeout(function () {
        port.set({rts: false, dtr: false}, function (err) {
          cb(err)
        })
      }, 100)
    })
  }

, uploadHex: function (port, filename, board, cb) {
    try {
      var data = fs.readFileSync(filename, { encoding: 'utf8' })
        , hex = intel_hex.parse(data).data

      var uploadPort = new SerialPort.SerialPort(port, {
        baudrate: board.baud
      })

      uploadPort.on('open', function () {
        borgutil.resetSerialPort(uploadPort, function () {
          Stk500.bootload(uploadPort, hex, board, function(error){
            uploadPort.close(function (error) {
              if (error) console.log(error)
              else console.log('upload finish')
              if (_.isFunction(cb)) cb(error)
            })
          })
        })
      })
    }
    catch (e) {
      console.log(e)
      if (_.isFunction(cb)) cb(e)
    }
  }
}

export default borgutil
