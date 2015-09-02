var _ = require('lodash')

var config = Object.create(null)
  , api = {}

api.get = function (key) {

  return key ? config[key] : config
}

api.set = function (newConfig, cb) {
  try {
    _.assign(config, newConfig)
    if (_.isFunction(cb)) cb(null)
  } catch (e) {
    if (_.isFunction(cb)) cb(e)
  }
}

module.exports = api
