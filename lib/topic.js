var topics = {}
  , user = {}

topics.prefix = function (topic) {
  return topic
}

topics.setUser = function (newUser) {
  console.log(user)
  user = newUser
}

module.exports = topics
