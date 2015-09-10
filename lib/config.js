var _ = require('lodash')
  , path = require('path')
  , fs = require('fs')

var config = Object.create(null)
  , api = {}

var configFile = fs.existsSync(path.join(__dirname, '../config/config.json'))
               ? '../config/config.json' : '../config/default.json'
_.assign(config, require(configFile))

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
