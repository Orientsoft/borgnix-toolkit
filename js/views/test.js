import React from 'react'
import $ from 'jquery'

class Test extends React.Component {
  render() {
    return (
      <h1>hello</h1>
    )
  }
}

var testView = {
  init: function () {
    React.render(
      <Test />
    , $('#main')[0]
    )
  }
}

export default testView
