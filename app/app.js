import React from 'react'
import MyNavBar from './nav-bar'
import { AppCanvas } from 'material-ui'
import Router from 'react-router'
import ThemeManager from './theme'

const RouteHandler = Router.RouteHandler

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
