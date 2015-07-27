import React from 'react'
import App from './app'
import Arduino from './arduino'
import Debug from './debug'
import $ from 'jquery'
import injectTapEventPlugin from "react-tap-event-plugin"
import Router from 'react-router'
import butil from './util'

butil.setHost('https://dev.borgnix.com')

const Route = Router.Route
    , DefaultRoute = Router.DefaultRoute

injectTapEventPlugin()

var routes = (
  <Route name='root' path='/' handler={App}>
    <Route name='upload' handler={Arduino}></Route>
    <Route name='debug' handler={Debug} />

    <DefaultRoute handler={Arduino}></DefaultRoute>
  </Route>
)

Router.create({
  routes: routes
, scrollBehaviour: Router.ScrollToTopBehaviour
})
.run(function (Handler, state) {
  React.render(<Handler/>, document.body)
})
