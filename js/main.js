require.config({
  baseUrl: '.'
, paths: {
    jquery: 'vendor/jquery/jquery'
  , es6: 'node_modules/requirejs-babel/es6'
  , babel: 'node_modules/requirejs-babel/babel-4.6.6.min'
  , react: 'vendor/react/react'
  , underscore: 'node_modules/underscore/underscore'
  , 'react-bs': 'vendor/react-bootstrap/react-bootstrap'
  , hterm: 'js/lib/hterm_all'
  , 'socketio': 'node_modules/socket.io/node_modules/socket.io-client/socket.io'
  , 'material': 'vendor/bootstrap-material-design/material'
  }
, shim: {
    hterm: {exports: 'hterm'}
  , material: ['jquery']
  }
})

require(['jquery', 'es6!js/app', 'react', 'material'], function ($, app, React) {
  $.material.init()
  app.init()
})
