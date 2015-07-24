import butil from './util'
import _ from 'underscore'

class User {
  constructor(uuid) {
    this.uuid = uuid
    this.devices = null
    this.online = false
  }

  login(token, cb) {
    let self = this
    butil.login(this.uuid, token, function (err, devices) {
      if (!err) {
        self.devices = devices
        self.online = true
        // CHANGE THIS ASAP
        self.token = token
      }
      if (_.isFunction(cb)) cb(err)
    })
  }
}

let user = new User('huangyuelong@orientsoft.cn')

export default user
