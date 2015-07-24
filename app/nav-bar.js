import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import {
  AppBar, LeftNav, Styles, Card, CardHeader, Avatar, IconMenu
} from 'material-ui'
import MenuItem from 'material-ui/lib/menus/menu-item'
import butil from './util'
import ThemeManager from './theme'
import MIconButton from './material-icon-button'
import pubsub from 'pubsub-js'
import user from './user'

class MyNavBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ports: []
    , selectValue: null
    , title: 'Borgnix Toolkit'
    }
    user.login('welcome3', function (err) {
      if (err) console.log(err)
      else console.log(this)
    })
  }

  componentDidMount() {
    var self = this
    pubsub.subscribe('change_title', function (topic, data) {
      self.setState({
        title: data
      })
    })
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
      , {route: 'debug', text: 'Test'}
      ]}
      onChange={function (e, selectedIndex, item) {
        // console.log(menuItems)
        self.context.router.transitionTo(item.route)
      }}
      header={
        <div className='user-info'>
        <Avatar style={{float: 'left'}}>{user.uuid[0].toUpperCase()}</Avatar>
        <IconMenu
            style={{float: 'right'}}
            iconButtonElement={
              <MIconButton icon='more_vert' style={{float: 'right'}}/>
            }>
          <MenuItem primaryText='Login'/>
          <MenuItem primaryText='Signup' />
        </IconMenu>

        <div style={{paddingLeft: 50}}>
          <span className='primary-text'>{user.uuid.substr(0, user.uuid.indexOf('@'))}</span>
          <br />
          <span className='secondary-text'>{user.uuid.substr(user.uuid.indexOf('@'))}</span>
        </div>

        </div>
      }>
      </LeftNav>
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
