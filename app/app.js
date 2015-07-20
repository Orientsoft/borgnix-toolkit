import React from 'react'
import Upload from './upload'
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

  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  render() {
    return (
      <AppCanvas>
        <MyNavBar/>
        <RouteHandler />
      </AppCanvas>
    )
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object
}

export default App
