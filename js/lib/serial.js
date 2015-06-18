var serialport = requireNode('serialport')

serialport.list(function (err, ports) {
  // console.log(ports)
  for (var port of ports)
    console.log(port)
  // console.log(serialport.sync)
})
