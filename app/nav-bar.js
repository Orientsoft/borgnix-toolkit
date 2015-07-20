import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import {
  AppBar, LeftNav, Styles
} from 'material-ui'
import butil from './util'
import ThemeManager from './theme'
import MIconButton from './material-icon-button'

class MyNavBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ports: []
    , selectValue: null
    , title: 'Borgnix Toolkit'
    }
  }

  componentDidMount() {
    var self = this
    // this.refs.leftNav.toggle()
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  render() {
    var self = this
    return (
      <div>
      <AppBar
        title={this.state.title}
        iconElementRight={<MIconButton icon='help' />}
        onLeftIconButtonTouchTap={function () {
          self.refs.leftNav.toggle()
        }} />
      <LeftNav ref='leftNav' docked={false} menuItems={[
        {route: 'upload', text: 'Arduino'}
      , {route: 'debug', text: 'Debug'}
      ]}
      onChange={function (e, selectedIndex, item) {
        // console.log(menuItems)
        self.context.router.transitionTo(item.route)
      }}></LeftNav>
      </div>

    )
  }
}

MyNavBar.childContextTypes = {
  muiTheme: React.PropTypes.object
}

MyNavBar.contextTypes = {
  router: React.PropTypes.func
}

export default MyNavBar
