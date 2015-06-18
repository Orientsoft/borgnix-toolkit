import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import ReactBs from 'react-bs'

var Input = ReactBs.Input
  , Button = ReactBs.Button

var SerialPort = requireNode('serialport')
  , async = requireNode('async')
  , intel_hex = requireNode('intel-hex')
  , Stk500 = requireNode('stk500')
  , fs = requireNode('fs')

var serialPorts = []

function getPorts (cb) {
  serialPorts = []
  SerialPort.list(function (err, ports) {
    serialPorts = ports
    if (_.isFunction(cb)) cb(ports)
  })
}

class PortList extends React.Component {
  render() {
    var els = []
    for (var port of serialPorts) {
      els.push(<option value={port.comName}>{port.comName}</option>)
    }
    return (
        <Input id={this.props.id} type="select" style={{width: '50%'}}>
          {els}
        </Input>
    )
  }
}

var serialportListView = {
  init: function () {
    getPorts(function (ports) {
      React.render(
        <div>
          <p>Upload serialport</p>
          <PortList id="upload-port" />
          <p>Upload file</p>
          <Input type="file" id="upload-file" />
          <Button onClick={show}>Upload</Button>
        </div>

      , $('#upload-container')[0]
      )
      React.render(
        <div>
          <p>Debug serialport</p>
          <PortList id="debug-port" />
          <Button onClick={listen}>Debug</Button>
          <Input id="debug-output" type="textarea" />
        </div>

      , $('#debug-container')[0]
      )
    })
  }
}

function listen () {
  var port = $('#debug-port').val()
  var s = new SerialPort.SerialPort(port, {baudrate: 115200})
  s.on('open', function (err) {
    if (err) console.log(err)
    console.log('OPEN', port)
    // s.write('a')
    s.on('data', function (data) {
      console.log(data.toString())
      $('#debug-output').append(data.toString())
    })
  })
}

function upload(path, filename, cb){
  var board = {
    name: "Arduino Uno",
    baud: 115200,
    signature: new Buffer([0x1e, 0x95, 0x0f]),
    pageSize: 128,
    timeout: 400
  };

  var data = fs.readFileSync(filename, { encoding: 'utf8' })

  var hex = intel_hex.parse(data).data

  var serialPort = new SerialPort.SerialPort(path, {
    baudrate: board.baud,
  });

  serialPort.on('open', function(){

    Stk500.bootload(serialPort, hex, board, function(error){

      serialPort.close(function (error) {
        console.log(error);
      });

      cb(error);
    });

  });

}

function show () {
  var filename = $('#upload-file').val()
    , port = $('#upload-port').val()

  console.log(filename, port)
  upload(port, filename, function (err) {
    if (err) console.log(err)
  })
}

export default serialportListView
