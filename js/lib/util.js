var SerialPort = requireNode('serialport')

var borgutil = {
  getPorts: function (cb) {
    SerialPort.list(function (err, ports) {
      if (_.isFunction(cb)) cb(ports)
    })
  }
}

export default borgutil
