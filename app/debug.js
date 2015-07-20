import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import {
  Styles, RaisedButton, SelectField, DropDownMenu, AppBar, Tab, Tabs
} from 'material-ui'
// import SerialPort from 'serialport'
import butil from './util'

var ThemeManager = new Styles.ThemeManager()

class Debug extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ports: []
    , selectValue: null
    }
  }

  componentDidMount() {
    var self = this
    butil.getPorts(function (ports) {
      self.setState({
        ports: ports.map(function (port, i) {
          return {name: port.comName}
        })
      , selectValue: self.state.selectValue || ports[0].name
      })
    })
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  render() {
    return (
      <div className='no-select'>
        <h1>debug</h1>
      </div>


    )
  }

  _handleSelectValueChange(key, e) {
    // console.log(e.target.value)
    var newState = {}
    newState[key] = e.target.value
    this.setState(newState)
    // console.log(a, b, c)
  }
}

Debug.childContextTypes = {
  muiTheme: React.PropTypes.object
}

export default Debug
