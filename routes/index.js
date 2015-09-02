var express = require('express')
  , config = require('../lib/config')

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
  res.json({status: 0})
})

module.exports = router
