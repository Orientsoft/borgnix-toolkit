var util = require('util')

var topics = {}
  , user = ''
  , replacerString = '&'
  , replacerRegex = /\&/g

topics.prefix = function (topic, portName) {
  return util.format(
    '/serial/%s/%s/%s'
  , user
  , portName.replace(/\//g, replacerString)
  , topic
  )
}

topics.wild = function (topic) {
  return util.format(
    '/serial/%s/%s/%s'
  , '+'
  , '+'
  , topic
  )
}

topics.resolve = function (topic) {
  var topicRegex = /^\/serial\/([A-Za-z0-9_\-]*)\/([A-Za-z0-9\-\&\.\_]*)\/([A-Za-z0-9_\-\/]*)/
    , match = topicRegex.exec(topic)

  var res = {
    user: match[1]
  , portName: match[2].replace(replacerRegex, '/')
  , topic: match[3]
  }
  return res
}

topics.setUser = function (newUser) {
  console.log(user)
  user = newUser
}

module.exports = topics
