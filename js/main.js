require.config({
  baseUrl: '.'
, paths: {
    jquery: 'bower_components/jquery/dist/jquery'
  , es6: 'node_modules/requirejs-babel/es6'
  , babel: 'node_modules/requirejs-babel/babel-4.6.6.min'
  , react: 'bower_components/react/react'
  , underscore: 'node_modules/underscore/underscore'
  , 'react-bs': 'bower_components/react-bootstrap/react-bootstrap'
  }
, shim: {

  }
})

require(['es6!js/app'], function (app) {
  app.init()
})
