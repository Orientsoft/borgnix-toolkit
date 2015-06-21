import testView from 'es6!js/views/test'
import uploadView from 'es6!js/views/upload'
import navbarView from 'es6!js/views/navbar'
import debugView from 'es6!js/views/debug'
import hterm from 'hterm'
import io from 'socketio'

console.log(hterm)

var app = {
  init: function () {
    // testView.init()
    uploadView.init()
    navbarView.init()
    debugView.init()

    // hterm.defaultStorage = new lib.Storage.Local()
    // var t = new hterm.Terminal()
    // t.decorate(document.getElementById('terminal-container'));
    // t.setCursorPosition(0, 0);
    // t.setCursorVisible(true);
    // t.setWidth(80)
    // t.setHeight(24)
    // t.Size.setTo(80, 24)
    // t.prefs_.set('ctrl-c-copy', true);
    // t.prefs_.set('use-default-window-copy', true);
    // t.prefs_.set('font-family', '"Lucida Console", monospace')
    // t.runCommandClass(NBssh)
    // this.startSocketIo(3002)
    var testio = io.connect('http://127.0.0.1:3002')
    testio.on('hello', function (data) {
      console.log('good');
    })

  }
}

export default app
