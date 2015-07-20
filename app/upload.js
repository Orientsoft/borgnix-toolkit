import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import {
  Styles, RaisedButton, SelectField, DropDownMenu, AppBar, Tab, Tabs
, Toolbar, ToolbarGroup, IconButton, ToolbarTitle, Dialog, TextField
, List, ListItem, FontIcon
} from 'material-ui'
import butil from './util'
import Terminal from './terminal'
import pubsub from 'pubsub-js'
import ThemeManager from './theme'
import MIconButton from './material-icon-button'
import db from './db'

var baudrates = [
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
            // console.log(port.name, newPortName)
            if (port.name === newPortName)
              port.alias = newPortAlias
            // console.log(port)
            return port
          })
        , selectedPort: null
        , activePort: {
            name: newPortName
          , alias: newPortAlias
          }
        })

        this.refs.newPortDialog.dismiss()
      }.bind(self)
    }
  ]
}

class Upload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ports: []
    , selectedPort: null
    , dockedPorts: []
    , height: 0
    , footerHeight: 0
    , activePort: {}
    }
  }

  componentDidMount() {
    var self = this
    butil.getPorts(function (ports) {
      self.setState({
        ports: ports.map(function (port, i) {
          return {name: port.comName}
        })
      , selectedPort: self.state.selectedPort || ports[0].name
      , selectedRate: self.state.selectedRate || 19200
      , height: $(React.findDOMNode(self)).parent().height() - 64
      , footerHeight: $(React.findDOMNode(self.refs.terminalFooter)).height()
      })
    })

    $(window).resize(function () {
      self.setState({
        height: $(React.findDOMNode(self)).parent().height()-64
      })
    })
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  render() {
    let ab = (
      <IconButton
          onTouchTap={function () {

          }}
          iconClassName="material-icons">
        close
      </IconButton>
    )
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
                      leftIcon={( self.state.activePort.name === port.name
                                ? <FontIcon className='material-icons'>done</FontIcon>
                                : <FontIcon className='material-icons'></FontIcon>)}
                      rightIconButton={
                        <IconButton
                            onTouchTap={function (ref, e) {
                              console.log(this.refs[ref])
                              let portAlias = this.refs[ref].props.primaryText

                            }.bind(this, ref)}
                            iconClassName="material-icons">
                          close
                        </IconButton>
                      }
                      onTouchTap={(ref, e)=>{
                        let portAlias = this.refs[ref].props.primaryText
                        let targetPort = _.find(this.state.dockedPorts, function (port) {
                          return port.alias === portAlias
                        })
                        this.setState({
                          activePort: targetPort
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
                onTouchTap={()=>{pubsub.publish('console_output', Date.now())}}/>
            <MIconButton
                icon='file_upload'
                onTouchTap={this._showDialog.bind(this, 'uploadDialog')}/>
            </div>

          </List>
        </div>
        <div
            className='col-sm-9'
            style={{overflow: 'hidden', height: this.state.height}}>
          <Terminal id='terminal' lineHeight={17}
              style={{height: this.state.height - this.state.footerHeight}}/>
          <div className='footer' ref='terminalFooter' style={{width: '100%'}}>
            <TextField />
            <RaisedButton label='send'></RaisedButton>
          </div>
        </div>
      </div>

      <Dialog
        ref='uploadDialog'
        title="Upload"
        autoScrollBodyContent={true}
        contentStyle={{height: '400px'}}
        actions={standardActions}>
        <SelectField
          value={this.state.selectedPort}
          onChange={this._handleSelectValueChange.bind(this, "selectedPort")}
          hintText="Serial Port"
          valueMember='name'
          displayMember='name'
          menuItems={this.state.ports}/>
        <br/>
        <SelectField
          value={this.state.selectedRate}
          onChange={this._handleSelectValueChange.bind(this, "selectedRate")}
          hintText="Baud Rate"
          valueMember='rate'
          displayMember='rate'
          menuItems={baudrates.map(function (rate) {
            return {rate: rate}
          })}/>
          <br/>
          <SelectField
            value={this.state.selectedRate}
            onChange={this._handleSelectValueChange.bind(this, "selectedRate")}
            hintText="Baud Rate"
            valueMember='rate'
            displayMember='rate'
            menuItems={baudrates.map(function (rate) {
              return {rate: rate}
            })}/>
          <br/>
          <SelectField
            value={this.state.selectedRate}
            onChange={this._handleSelectValueChange.bind(this, "selectedRate")}
            hintText="Baud Rate"
            valueMember='rate'
            displayMember='rate'
            menuItems={baudrates.map(function (rate) {
              return {rate: rate}
            })}/>
      </Dialog>

      <Dialog
        ref='newPortDialog'
        title="Upload"
        actions={newPortAction(this)}>
        <TextField ref='portAlias' />
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
}

Upload.childContextTypes = {
  muiTheme: React.PropTypes.object
}

export default Upload
