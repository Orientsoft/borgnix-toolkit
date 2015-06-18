import testView from 'es6!js/views/test'
// import 'js/lib/serial'
import serialportListView from 'es6!js/views/serialport-list'

console.log(testView)

var app = {
  init: function () {
    // testView.init()
    serialportListView.init()
  }
}

export default app
