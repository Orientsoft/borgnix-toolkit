import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import ReactBs from 'react-bs'
import DebugView from 'es6!js/views/debug'
import borgutil from 'es6!js/lib/util'
import BAC from 'es6!js/node_modules/arduino-compiler/client'
import BPM from 'es6!js/node_modules/borgnix-project-manager/client'

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

var bac = new BAC({
  host: 'http://127.0.0.1:3000'
, prefix: '/c'
})

var bpm = new BPM({
  host: 'http://127.0.0.1:3000'
, prefix: '/p'
})

// bac.findHex({
//   uuid: 'uuid'
// , token: 'token'
// , type: 'arduino'
// , name: 'aaa'
// }, function (send) {
//   console.log(send)
// })
//
// console.log(bpm)
//
// bpm.listProject({uuid: 'uuid', token:'token', type:'arduino'}, function (projects) {
//   console.log(projects)
// })

class PortList extends React.Component {
  render() {
    return (
      <Input id={this.props.id} type="select" style={{width: '50%'}}
             label="Serial Port" labelClassName='col-xs-2'
             wrapperClassName='col-xs-10'>
        {this.props.ports.map(function (port) {
          return <option value={port.comName}>{port.comName}</option>
        })}
      </Input>
    )
  }
}

class CloudHexList extends React.Component {
  render () {
    return (
      <Input type='select' id={this.props.id} label='Cloud Hex File'
             labelClassName='col-xs-2' wrapperClassName='col-xs-10'>
        {
          this.props.projects.map(function (project) {
            return <option value={project.name}>{project.name + '.hex'}</option>
          })
        }
      </Input>
    )
  }
}

class Upload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ports: []
    , projects: []
    }
  }

  componentDidMount() {
    var self = this
    borgutil.getPorts(function (ports) {
      self.setState({
        ports: ports
      })
    })

    bpm.listProject({uuid: 'uuid', token:'token', type:'arduino'}, function (projects) {
      self.setState({
        projects: projects
      })
    })
  }

  render() {
    return (
      <div className="container-fluid">
        <form className='form-horizontal'>
        <PortList id="upload-port" ports={this.state.ports} />
        <Input type="file" id="upload-file" label="Hex File"
               labelClassName='col-xs-2' wrapperClassName='col-xs-10'/>

        <CloudHexList id='upload-cloud-file' projects={this.state.projects}></CloudHexList>
        <Button onClick={this.downloadHex.bind(this)}>Download Cloud File</Button>

        <ButtonToolbar>
        <Button bsStyle='primary' onClick={this.upload.bind(this)}>Upload</Button>
        <Button bsStyle='primary' onClick={this.test.bind(this)}>Test</Button>
        <Button bsStyle='primary' onClick={function () {
          win.reload()
        }}>Refresh</Button>
        </ButtonToolbar>
        </form>
        <Input type="textarea" id="upload-console" rows={10}></Input>
      </div>
    )
  }

  upload() {
    var self = this
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

  test() {
    // console.log(this)
    var port = $('#upload-port').val()
      , self = this

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

  log(content) {
    var $textarea = $('#upload-console')
    $textarea.append(content+'\n')
  }

  downloadHex() {
    bac.findHex({uuid: 'uuid', token: 'token', name:$('#upload-cloud-file').val(), type: 'arduino'}, function (send) {
      // console.log('I got this', send)
      console.log($('#download-frame').attr('src', send.url))
    })
  }
}

export default Upload
