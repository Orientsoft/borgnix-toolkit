import $ from 'jquery'
// import _ from 'lodsh'

let settings = {}

settings.setAuth = function (auth, cb) {
  $.ajax({
    method: 'POST'
  , url: '/setting'
  , json: true
  , data: auth
  , success: cb
  })
}

settings.getAuth = function (cb) {
  $.ajax({
    method: 'GET'
  , url: '/setting'
  , success: cb
  })
}

export default settings
