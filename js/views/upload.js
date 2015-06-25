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
      <Input id={this.props.id} type="select" style={{width: '50%'}} label="upload"
             labelClassName='col-xs-2' wrapperClassName='col-xs-10'>
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
          <form className='form-horizontal'>
          <PortList id="upload-port" ports={ports} />
          <Input type="file" id="upload-file" label="upload file"
                 labelClassName='col-xs-2' wrapperClassName='col-xs-10'/>

          <ButtonToolbar>
          <Button bsStyle='primary' onClick={self.upload}>Upload</Button>
          <Button bsStyle='primary' onClick={self.test}>Test</Button>
          <Button bsStyle='primary' onClick={function () {
            win.reload()
          }}>Refresh</Button>
          </ButtonToolbar>
          </form>
          <Input type="textarea" id="upload-console" rows={10}></Input>
        </div>

      , $('#upload-container')[0]
      )
    })
  }

, upload: function () {
    var self = uploadView
    var filename = $('#upload-file').val()
      , port = $('#upload-port').val()

    self.log('Uploading ' + filename + ' to ' + port + '...')

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

      uploadPort.on('open', function () {
        borgutil.resetSerialPort(uploadPort, function () {
          Stk500.bootload(uploadPort, hex, board, function(error){
            if (error) {
              self.log('Upload failed.')
              self.log(error)
            }
            uploadPort.close(function (error) {
              if (error) console.log(error)
              else {
                console.log('upload finish')
                self.log('Upload finished')
              }
            })
          })
        })
      })
    }
    catch (e) {
      console.log(e)
      self.log(e)
    }
  }

, test: function () {
    var port = $('#upload-port').val()
      , self = uploadView

    var board = {
      name: "Arduino Uno",
      baud: 115200,
      signature: new Buffer([0x1e, 0x95, 0x0f]),
      pageSize: 128,
      timeout: 400
    }

    self.log('Uploading test program...')

    borgutil.uploadHex(port, 'hex/hello_borgnix.hex', board, function (err) {
      if (err) console.log(err)
      else {
        console.log('test uploaded', self)
        self.log('Test program uploaded. You should see the LED light on your'
          + ' arduino flashing.'
        )
      }
    })
  }

, log: function (content) {
    var $textarea = $('#upload-console')
    $textarea.append(content+'\n')
  }

}

export default uploadView
