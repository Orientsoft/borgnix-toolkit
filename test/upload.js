var butil = require('../lib/util')
  , borgnixJar = require('../lib/cookie-jar')

var board = require('arduino-compiler/data/boards').uno

butil.setHost('http://voyager.orientsoft.cn')
butil.setCookieJar(borgnixJar)

butil.login('demo@borgnix.com', 'welcome1', function (err, body) {
  if (err) return butil.printErrorStack(err)
  // console.log(body)
  if (body.status.toLowerCase() === 'ok')
    console.log('login good')
  // var param = {
  //   name: 'uno'
  // , baud: parseInt(board.upload.speed)
  // , signature: new Buffer(board.signature, 'hex')
  // , pageSize: 128
  // , timeout: 400
  // }
  butil.getHex({name: 'api-test', type: 'arduino', board: 'uno'}, function (data) {
    console.log(data)
  })
})
