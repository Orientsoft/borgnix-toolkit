import React from 'react'
import MyNavBar from './nav-bar'
import {
  Styles, RaisedButton, SelectField, DropDownMenu, AppBar, Tab, Tabs, AppCanvas
} from 'material-ui'
import Router from 'react-router'
import butil from './util'
import ThemeManager from './theme'

const Route = Router.Route
    , RouteHandler = Router.RouteHandler
    , DefaultRoute = Router.DefaultRoute

class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      title: 'Borgnix Toolkit'
    }
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  componentDidUpdate() {

  }

  render() {
    return (
      <AppCanvas>
        <MyNavBar />
        <RouteHandler ref='route'/>
      </AppCanvas>
    )
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object
}

export default App
