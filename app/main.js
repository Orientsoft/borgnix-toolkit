import React from 'react'
import App from './app'
import Upload from './upload'
import Debug from './debug'
import $ from 'jquery'
import injectTapEventPlugin from "react-tap-event-plugin"
import Router from 'react-router'
import butil from './util'

butil.setHost('https://dev.borgnix.com')

// butil.login('huangyuelong@orientsoft.cn', 'welcome3', function (err, b) {
//   if (err) console.log(err)
//   else console.log(b)
// })

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
