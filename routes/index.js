var express = require('express')
  , config = require('../lib/config')
  , butil = require('../lib/util')
  , listener = require('../lib/listener')
  // , jar = require('../lib/cookie-jar')
  // , cookieParser = require('cookie-parser')

var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
  console.log('inside /')
  res.render('index', { title: 'Express' })
})

router.get('/setting', function (req, res) {
  console.log('inside /setitng')
  // console.log(req.body)
  res.json(config.get())
})

router.post('/setting', function (req, res) {
  console.log(req.body)
  config.set(req.body)
  if (req.body.username && req.body.password)
    butil.login(req.body.username, req.body.password, function (e, b) {
      console.log('login result', e, b)
      console.log(b.devices[0])
      var device = b.devices[0]
      config.set(device, function () {
        listener.restart()
      })
    })
  res.json({status: 0})
})

router.post('/login', function (req, res) {
  if (req.body.username && req.body.password)
    butil.login(req.body.username, req.body.password, function (e, b) {
      console.log('login result', e, b)
      console.log(b.devices[0])
      var device = b.devices[0]
      config.set(device, listener.restart.bind(listener))
    })
  res.json({status: 0})
})

module.exports = router
