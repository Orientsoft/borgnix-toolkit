import React from 'react'
import App from './app'
import Upload from './upload'
import Debug from './debug'
import $ from 'jquery'
import injectTapEventPlugin from "react-tap-event-plugin"
import Router from 'react-router'

const Route = Router.Route
    , DefaultRoute = Router.DefaultRoute

injectTapEventPlugin()

var routes = (
  <Route name='root' path='/' handler={App}>
    <Route name='upload' handler={Upload}></Route>
    <Route name='debug' handler={Debug} />

    <DefaultRoute handler={Upload}></DefaultRoute>
  </Route>
)

Router.create({
  routes: routes
, scrollBehaviour: Router.ScrollToTopBehaviour
})
.run(function (Handler, state) {
  React.render(<Handler/>, document.body)
})
