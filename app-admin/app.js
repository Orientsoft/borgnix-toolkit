import React from 'react'
import settings from './settings'
import _ from 'lodash'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: null
    , password: null
    }
  }

  submit() {
    console.log(this.state)
    console.log(settings)
    settings.setAuth(_.pick(this.state, ['username', 'password']), function () {
      console.log('auth set')
      settings.getAuth(function (data) {
        console.log(data)
      })
    })
  }

  _handleChange(key, event) {
    console.log(key, event.target.value)
    let newState = {}
    newState[key] = event.target.value
    this.setState(newState)
  }

  render() {
    return (
      <div>
        <p>Username</p>
        <input type='text' ref='username'
            onChange={this._handleChange.bind(this, 'username')}/>
        <p>Password</p>
        <input type='password' ref='password'
            onChange={this._handleChange.bind(this, 'password')}/>
        <br />
        <button onClick={this.submit.bind(this)}>Submit</button>
      </div>
    )
  }
}

App.propTypes = {

}

App.defaultProps = {

}

export default App
