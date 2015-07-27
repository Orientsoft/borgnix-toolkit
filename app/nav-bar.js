import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import {
  AppBar, LeftNav, Styles, Card, CardHeader, Avatar, IconMenu, Dialog, TextField
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
    // user.login('welcome3', function (err) {
    //   if (err) console.log(err)
    //   else console.log(this)
    // })
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
        <Avatar style={{float: 'left'}}>
          {user.uuid ? user.uuid[0].toUpperCase() : 'B'}
        </Avatar>
        <IconMenu
            style={{float: 'right'}}
            iconButtonElement={
              <MIconButton icon='more_vert' style={{float: 'right'}}/>
            }>
          {userMenu.bind(this)(user.online)}
        </IconMenu>

        <div style={{paddingLeft: 50}}>
          <span className='primary-text'>
            {user.online ? user.uuid.substr(0, user.uuid.indexOf('@')) : 'Please Login'}
          </span>
          <br />
          <span className='secondary-text'>
            {user.online ? user.uuid.substr(user.uuid.indexOf('@')) : ''}
          </span>
        </div>

        </div>
      }>
      </LeftNav>

      <Dialog
          ref='loginDialog'
          title='Login'
          actions={[
            { text: 'Cancel'}
          , { text: 'Login'
            , onTouchTap: ()=>{
              let self = this
                , username = self.refs.loginUsername.getValue()
                , password = self.refs.loginPassword.state.hasValue
              user.logout()
              user.login({uuid: username, token: password}, (err)=>{
                if (err) console.log(err)
                else {
                  console.log('login good')
                  self.refs.loginDialog.dismiss()
                  self.forceUpdate()
                  // console.log(user)
                }
              })
            }.bind(this)
          }]}>
        <TextField
            ref='loginUsername'
            defaultValue='huangyuelong@orientsoft.cn'
            floatingLabelText='Username'/>
        <br />
        <TextField
            ref='loginPassword'
            floatingLabelText='Password'>
          <input type='password'/>
        </TextField>
      </Dialog>
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

function userMenu(online) {
  if (online)
    return [
      <MenuItem
          primaryText='Logout'
          onTouchTap={()=>{
            user.logout()
            this.forceUpdate()
          }}/>
    ]
  else
    return [
      <MenuItem
          primaryText='Login'
          onTouchTap={()=>{
            this.refs.loginDialog.show()
          }}/>
    , <MenuItem primaryText='Signup'/>
    ]
}

export default MyNavBar
