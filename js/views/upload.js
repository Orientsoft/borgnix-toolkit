import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import ReactBs from 'react-bs'
import DebugView from 'es6!js/views/debug'
import borgutil from 'es6!js/lib/util'

var Input = ReactBs.Input
  , Button = ReactBs.Button
  , TabbedArea = ReactBs.TabbedArea
  , TabPane = ReactBs.TabPane
  , DropdownButton = ReactBs.DropdownButton
  , MenuItem = ReactBs.MenuItem
  , ButtonGroup = ReactBs.ButtonGroup
  , Grid = ReactBs.Grid
  , Row = ReactBs.Row
  , Col = ReactBs.Col
  , ButtonToolbar = ReactBs.ButtonToolbar
  , Panel = ReactBs.Panel

var SerialPort = requireNode('serialport')
  , async = requireNode('async')
  , intel_hex = requireNode('intel-hex')
  , Stk500 = requireNode('stk500')
  , fs = requireNode('fs')


class PortList extends React.Component {
  render() {
    return (
      <Input id={this.props.id} type="select" style={{width: '50%'}}>
        {this.props.ports.map(function (port) {
          return <option value={port.comName}>{port.comName}</option>
        })}
      </Input>
    )
  }
}

var uploadView = {
  init: function () {
    var self = this
    borgutil.getPorts(function (ports) {
      React.render(
        <div className="container-fluid">
          <p>Upload serialport</p>
          <PortList id="upload-port" ports={ports} />
          <p>Upload file</p>
          <Input type="file" id="upload-file" />
          <Button onClick={self.upload}>Upload</Button>
        </div>

      , $('#upload-container')[0]
      )
    })
  }

, upload: function () {
    var self = uploadView
    var filename = $('#upload-file').val()
      , port = $('#upload-port').val()

    var board = {
      name: "Arduino Uno",
      baud: 115200,
      signature: new Buffer([0x1e, 0x95, 0x0f]),
      pageSize: 128,
      timeout: 400
    }

    try {
      var data = fs.readFileSync(filename, { encoding: 'utf8' })
        , hex = intel_hex.parse(data).data

      var uploadPort = new SerialPort.SerialPort(port, {
        baudrate: board.baud
      })

      uploadPort.on('open', function(){
        Stk500.bootload(uploadPort, hex, board, function(error){
          uploadPort.close(function (error) {
            if (error) console.log(error)
            else console.log('upload finish')
          })
        })
      })
    }
    catch (e) {
      console.log(e)
    }
  }

, debugPort: null

}

export default uploadView
