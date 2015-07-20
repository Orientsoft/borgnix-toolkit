import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import ReactBs from 'react-bs'
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

var DebugPane = React.createClass({
  render() {
    function genOpt(value) {
      return <option value={value} >{value}</option>
    }

    var baudrates = [ 300, 1200, 2400, 4800, 9600
                    , 19200, 38400, 57600, 115200, 230400, 250000]

    return (
      <div className="container-fluid" style={{marginTop: 10}}>
        <Panel header={this.props.port}>

        <Input id="debug-output" type="textarea" onChange={function (e) {
          console.log(e.target.value)
        }}  rows={10}/>
        <ButtonToolbar>
          <Input id="debug-baudrate" type="select"
                 style={{width: 100, display: 'inline-block'}}>
            {baudrates.map(genOpt)}
          </Input>
          <Button bsStyle='primary' onClick={this.debug}>Debug</Button>
          <Button bsStyle='primary' onClick={this.stopDebug}>Stop</Button>
          <Button bsStyle='primary' onClick={this.clear}>Clear</Button>
        </ButtonToolbar>
        </Panel>

        <Input type='text' id="debug-input" buttonAfter={
          <Button onClick={this.send}>send</Button>
        } />
      </div>
    )
  }

, debug() {
    var self = this
    var port = this.props.port
      , baudrate = parseInt($('#debug-baudrate', $(self.getDOMNode())).val())


    self.stopDebug()
    self.debugPort = new SerialPort.SerialPort(port, {baudrate: baudrate})

    self.debugPort.on('open', function (err) {
      if (err) console.log(err)
      console.log('debug port openned')
      this.on('data', function (data) {
        console.log(data.toString())
        var $textarea = $('#debug-output', $(self.getDOMNode()))
        $textarea.append(data.toString())
        if($textarea.length)
          $textarea.scrollTop($textarea[0].scrollHeight - $textarea.height())
      })
    }).on('close', function (err) {
      console.log('debug port closed')
    })
  }

, stopDebug() {
    if (this.debugPort)
      this.debugPort.close(function (err) {
        console.log('debug port closed')
      })
  }

, clear()  {
    var $textarea = $('#debug-output', $(this.getDOMNode()))
    $textarea.text('')
  }

, send() {
    var $input = $('#debug-input', $(this.getDOMNode()))
    console.log($input.val())
    var toSend = $input.val() + '\n'
    this.debugPort.write(toSend, function (err) {
      if (err) console.log(err)
      $input.val('')
    })
  }
})

class Debug extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ports: []
    }
  }

  componentDidMount() {
    var self = this
    borgutil.getPorts(function (ports) {
      self.setState({
        ports: ports
      })
    })
  }

  render() {
    var self = this
    return (
      <TabbedArea defaultActiveKey={1}>
        {
          this.state.ports.map(function (port, i) {
            return (
              <TabPane eventKey={parseInt(i)+1} tab={'serial '+(parseInt(i)+1)}>
                <DebugPane port={port.comName} />
              </TabPane>
            )
          })
        }
      </TabbedArea>
    )
  }
}

export default Debug
