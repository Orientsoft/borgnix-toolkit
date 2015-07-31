import React from 'react'
// import $ from 'jquery'
// import _ from 'underscore'
import {
  Styles, Tab, Tabs
} from 'material-ui'
// import SerialPort from 'serialport'
import butil from './util'
import pubsub from 'pubsub-js'

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
    pubsub.publish('change_title', 'Test')
    butil.getPorts(function (ports) {
      self.setState({
        ports: ports.map(function (port) {
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
        <Tabs tabWidth={75} tabItemContainerStyle={{width: 150}}>
          <Tab label='tab 1'>111</Tab>
          <Tab label='tab 2'>222</Tab>
        </Tabs>
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
