import React from 'react'
import App from './app'
import Arduino from './arduino'
// import Debug from './debug'
// import $ from 'jquery'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Router from 'react-router'
import butil from './util'
import {borgnixJar} from './cookie-jar'

butil.setHost('http://voyager.orientsoft.cn')
butil.setCookieJar(borgnixJar)

const Route = Router.Route
    , DefaultRoute = Router.DefaultRoute

injectTapEventPlugin()

var routes = (
  <Route name='root' path='/' handler={App}>
    <Route name='upload' handler={Arduino}/>

    <DefaultRoute handler={Arduino}/>
  </Route>
)

Router.create({
  routes: routes
, scrollBehaviour: Router.ScrollToTopBehaviour
})
.run(function (Handler) {
  React.render(<Handler/>, document.body)
})
