import butil from './util'
import _ from 'underscore'

class User {
  constructor(uuid) {
    this.uuid = uuid
    this.devices = null
    this.online = false
  }

  login(opts, cb) {
    let self = this
    if (this.uuid && opts.uuid) {
      let err = new Error('Logout first')
      if (_.isFunction(cb)) return cb(err)
    }
    if (_.isString(opts)) opts = {token: opts}
    if (opts.uuid) this.uuid = opts.uuid

    butil.login(this.uuid, opts.token, function (err, res) {
      if (!err) {
        res = JSON.parse(res)
        if (res.status === 'ok') {
          self.devices = res.devices
          self.online = true
          // CHANGE THIS ASAP
          self.token = opts.token
        }
        else {
          console.log(res)
          err = new Error(res.msg)
        }
      }
      if (_.isFunction(cb)) cb(err)
    })
  }

  logout() {
    this.uuid = null
    this.token = null
    this.devices = null
    this.online = false
  }
}

let user = new User(null)

export default user
