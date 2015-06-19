import testView from 'es6!js/views/test'
import uploadView from 'es6!js/views/upload'
import navbarView from 'es6!js/views/navbar'
import debugView from 'es6!js/views/debug'

console.log(testView)

var app = {
  init: function () {
    // testView.init()
    uploadView.init()
    navbarView.init()
    debugView.init()
  }
}

export default app
