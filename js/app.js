import testView from 'es6!js/views/test'
import Upload from 'es6!js/views/upload'
import navbarView from 'es6!js/views/navbar'
import Debug from 'es6!js/views/debug'
import hterm from 'hterm'
import io from 'socketio'
import React from 'react'
import $ from 'jquery'
import ReactBs from 'react-bs'

const TabbedArea = ReactBs.TabbedArea
    , TabPane = ReactBs.TabPane

var app = {
  init: function () {
    // testView.init()
    // uploadView.init()
    // navbarView.init()
    // debugView.init()
    // React.render(<Upload />, $('#upload-container')[0])
    // React.render(<Debug />, $('#debug-container')[0])
    React.render(<App />, $('#debug-container')[0])
    // arduinoView.init('#terminal-container')

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
    // var testio = io.connect('http://127.0.0.1:3002')
    // testio.on('hello', function (data) {
    //   console.log('good');
    // })

  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <TabbedArea defaultActiveKey={1}>
        <TabPane eventKey={1} tab='Upload *'>
          <Upload />
        </TabPane>
        <TabPane eventKey={2} tab='Debug *'>
          <Debug />
        </TabPane>
      </TabbedArea>
    )
  }
}

export default app
