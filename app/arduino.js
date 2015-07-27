import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import {
  Styles, RaisedButton, SelectField, DropDownMenu, AppBar, Tab, Tabs
, Toolbar, ToolbarGroup, IconButton, ToolbarTitle, Dialog, TextField
, List, ListItem, FontIcon, FlatButton, Snackbar
} from 'material-ui'
import MenuItem from 'material-ui/lib/menus/menu-item'
// import Menu from 'material-ui/lib/menus/menu'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import butil from './util'
import Terminals from './terminals'
import pubsub from 'pubsub-js'
import ThemeManager from './theme'
import MIconButton from './material-icon-button'
import db from './db'
import {SerialPort} from 'serialport'
import FileSelect from './file-select'
import fs from 'fs'
import BAC from 'arduino-compiler/client-node'
import BoardSelect from './board-select'

let bac = new BAC({ host: 'http://localhost:3000', prefix: '/c'})

console.log(bac.getBoards)

bac.getBoards(function (err, boards) {
  if (err) console.log(err)
  console.log(JSON.parse(boards))
})

let baudrates = [
  300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 250000
]

let standardActions = [
  { text: 'Cancel' },
  { text: 'Submit', onTouchTap: function () {
    console.log('action!')
  }}
]

function newPortAction(self) {
  return [
    {text: 'Cancel'}
  , { text: 'Add'
    , onTouchTap: function () {
        let newPortAlias = this.refs.portAlias.getValue()
          , newPortName = this.refs.portName.props.value

        console.log(this.refs.portName)
        this.setState({
          dockedPorts: this.state.dockedPorts.concat([{
            name: newPortName
          , alias: newPortAlias
          }])
        , ports: this.state.ports.map(function (port) {
            if (port.name === newPortName)
              port.alias = newPortAlias
            return port
          })
        , selectedPort: null
        , activePort: {
            name: newPortName
          , alias: newPortAlias
          }
        })

        this.refs.terms.add({id: newPortAlias})
        this.refs.terms.setState({
          activeTerm: {id: newPortAlias}
        })

        this.refs.newPortDialog.dismiss()
      }.bind(self)
    }
  ]
}


function uploadAction(self) {
  return [
    {text: 'Cancel'}
  , { text: 'Upload'
    , onTouchTap: function(){
      // console.log(this)
        let self = this
        let fileType = 'local'
          , fileName = this.refs.uploadFileName.getValue()
          , port = this.refs.uploadPort.props.value
        let board = this.refs.uploadBoard.getSelectedBoard()

        let param = {
          name: board.name
        , baud: parseInt(board.upload.speed)
        , signature: board.signature
        , pageSize: 128
        , timeout: 400
        }

        console.log(board)

        if (fileType === 'local') {
          this.setState({
            uploadMessage: 'progress'
          })
          this.refs.uploadProgress.show()
          butil.uploadHex(port, fileName, param, function (err) {
            if (err) console.log(err)
            self.setState({
              uploadMessage: (err ? 'error' : 'successful')
            })
            if (!err) self.refs.uploadDialog.dismiss()
            setTimeout(function () {
              self.refs.uploadProgress.dismiss()
            }, 1000);
          })
        }
      }.bind(self)
    }
  ]
}

class Upload extends React.Component {
  constructor(props) {
    super(props)
    this.serialPort = []
    this.state = {
      ports: []
    , selectedPort: null
    , selectedRate: null
    , selectedFileType: 'local'
    , dockedPorts: []
    , height: 0
    , footerHeight: 0
    , activePort: {}
    , uploadMessage: 'Uploading'
    }
  }

  componentDidMount() {
    var self = this
    pubsub.publish('change_title', 'Borgnix Arduino Tool')
    butil.getPorts(function (ports) {
      self.setState({
        ports: ports.map(function (port, i) {
          return {name: port.comName}
        })
      , selectedPort: self.state.selectedPort || ports[0].name
      })
    })

    self.setState({
      selectedRate: self.state.selectedRate || 19200
    , height: $(React.findDOMNode(self)).parent().height() - 64
    , footerHeight: $(React.findDOMNode(self.refs.terminalFooter)).height()
    })

    // force the window to resize so the terminal div resize properly
    let win = gui.Window.get()
      , w = win.width
      , h = win.height
    win.resizeTo( w, h+1)
    win.resizeTo( w, h)

    $(window).resize(function () {
      self.setState({
        height: $(React.findDOMNode(self)).parent().height() - 64
      })
    })
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  render() {
    let self = this
    return (
      <div className='no-select'>
      <div className='row'>
        <div className='col-sm-3' id='port-select-nav'>
          <List
              ref='port-list'
              style={{height: this.state.height}}>
            {
              this.state.dockedPorts.map((port)=>{
                let ref = 'portItem'+port.alias
                return (
                  <ListItem
                      ref={ref}
                      primaryText={port.alias}
                      leftIcon={<FontIcon className='material-icons'>
                                  {( self.state.activePort.name === port.name
                                  ? 'done'
                                  : '')}
                                </FontIcon>}
                      rightIconButton={self._rightIconMenu(ref)}
                      onTouchTap={(ref, e)=>{
                        let portAlias = this.refs[ref].props.primaryText
                        let targetPort = _.find(this.state.dockedPorts, function (port) {
                          return port.alias === portAlias
                        })
                        this.setState({
                          activePort: targetPort
                        })
                        this.refs.terms.setState({
                          activeTerm: {id: portAlias}
                        })
                      }.bind(this, ref)}/>
                )
              })
            }
            <div className='footer'>
            <MIconButton
                icon='add'
                onTouchTap={this._showDialog.bind(this, 'newPortDialog')}/>
            <MIconButton
                icon='play_arrow'
                onTouchTap={this._openPort.bind(this)}/>
            <MIconButton
                icon='file_upload'
                onTouchTap={this._showDialog.bind(this, 'uploadDialog')}/>
            </div>

          </List>
        </div>
        <div
            className='col-sm-9'
            style={{ overflow: 'hidden'
                   , height: this.state.height
                   , paddingLeft: 0}}>
          <Terminals
              ref='terms' lineHeight={17}
              onContextMenu={(e)=>{
                // console.log('context menu', this)
                e.preventDefault()
                console.log(e.pageX, e.pageY)
                console.log(this.refs)
              }.bind(this)}
              style={{
                height: this.state.height - this.state.footerHeight
              , paddingLeft: 15
              , paddingBottom: 15
              }}
              terms={[
                {id: 'default'}
              ]}/>
          <div className='footer' ref='terminalFooter'>
            <TextField ref='serialInput' style={{
              // width: $(React.findDOMNode(this.refs.terminalFooter)).width() - 150
            paddingLeft: 15
            }}/>
            <FlatButton
                label='send' secondary={true} ref='serialSend'
                onTouchTap={function () {
                  let sp = this.serialPort[this.state.activePort.name]
                  sp.write(this.refs.serialInput.getValue()+'\n')
                  this.refs.serialInput.clearValue()
                }.bind(this)}
                style={{left: 20}}/>
            <FlatButton
                label='clear' secondary={true} ref='serialClear'
                onTouchTap={function () {
                  // let sp = this.serialPort[this.state.activePort.name]
                  // sp.write(this.refs.serialInput.getValue()+'\n')
                  // this.refs.serialInput.clearValue()
                  this.clearActiveConsole()
                }.bind(this)}
                style={{left: 20}}/>
          </div>
        </div>
      </div>

      <Dialog
        ref='uploadDialog'
        title="Upload"
        // autoScrollBodyContent={true}
        // contentInnerStyle={{height: 500}}
        // autoDetectWindowHeight={true}
        // contentStyle={{height: '400px'}}
        actions={uploadAction(this)}>
        <SelectField
          ref='uploadPort'
          value={this.state.selectedPort}
          onChange={this._handleSelectValueChange.bind(this, "selectedPort")}
          floatingLabelText="Serial Port"
          valueMember='name'
          displayMember='name'
          menuItems={this.state.ports}/>
        <br/>
        <BoardSelect ref='uploadBoard' />
        <br/>
        <FileSelect ref='uploadFileName'/>
        <br/>
        <br/>
        <br/>
        <br/>
      </Dialog>

      <Dialog
        ref='newPortDialog'
        title="New Port"
        actions={newPortAction(this)}>
        <TextField ref='portAlias' floatingLabelText='name'/>
        <br/>
        <SelectField
          ref='portName'
          value={this.state.selectedPort}
          onChange={this._handleSelectValueChange.bind(this, "selectedPort")}
          floatingLabelText="Serial Port"
          valueMember='name'
          displayMember='name'
          menuItems={this.state.ports.filter(function (port) {
            return _.isUndefined(port.alias)
          })}/>
      </Dialog>

      <Snackbar
        ref='uploadProgress'
        message={function () {
          switch (this.state.uploadMessage) {
            case 'progress':
              return 'Uploading'
            case 'error':
              return 'Upload Error'
            case 'successful':
              return 'Upload Successful'
            default:
              return 'Uploading'
          }
        }.bind(this)()}
        />
      </div>
    )
  }

  _handleSelectValueChange(key, e) {
    var newState = {}
    newState[key] = e.target.value
    this.setState(newState)
  }

  _showDialog(name) {
    this.refs[name].show()
  }

  _rightIconMenu(ref) {
    return (
      <IconMenu
          iconButtonElement={
            <MIconButton
                touch={true}
                tooltip="more"
                icon='more_vert'
                tooltipPosition="bottom-left"/>
          }>
        <MenuItem
            primaryText='Remove'
            onTouchTap={()=>{
              let portAlias = this.refs[ref].props.primaryText
              this.setState({
                dockedPorts: this.state.dockedPorts.filter((port)=>{
                  return port.alias !== portAlias
                })
              , ports: this.state.ports.map((port)=>{
                  if (port.alias === portAlias) {
                    return _.omit(port, 'alias')
                  }
                  return port
                })
              , activePort: _.find(this.state.dockedPorts, (port)=>{
                  return port.alias !== portAlias
                })
              })
            }}/>
      </IconMenu>
    )
  }

  _openPort() {
    console.log(this.state.activePort)
    let portName = this.state.activePort.name
      , portAlias = this.state.activePort.alias


    let sp = new SerialPort(portName, {baudrate: 19200})

    this.serialPort[portName] = sp

    sp.on('open', function () {
      console.log(portName, 'opened')
      sp.on('data', function (data) {
        pubsub.publish('console_output_'+portAlias, data)
      })
      sp.on('error', function (err) {
        publish.publish('console_output_'+portAlias, err)
      })
    })
  }

  clearActiveConsole() {
    let clear = '\u001b[2J\u001b[0;0H'
      , portAlias = this.state.activePort.alias
    pubsub.publish('console_output_'+portAlias, clear)
  }
}

Upload.childContextTypes = {
  muiTheme: React.PropTypes.object
}

export default Upload
