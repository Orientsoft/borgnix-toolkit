import React from 'react'
import Terminal from 'term.js'
import $ from 'jquery'
import pubsub from 'pubsub-js'

class TerminalComponent extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <div {...this.props}>
      </div>
    )
  }

  componentDidMount() {
    var self = this

    this.term = new Terminal({
      convertEol: true
    , screenKeys: true
    })
    this.term.open(React.findDOMNode(this))
    this.resize()
    $(window).resize(function () {
      self.resize()
    })

    pubsub.subscribe('console_output', function (topic, data) {
      self.term.writeln(data)
    })
  }

  resize() {
    var $elem = $(React.findDOMNode(this))
    // console.log($elem)
    var width = parseInt($elem.width())
    var cols = Math.floor(width / 8)
    var height = parseInt($elem.height())
    console.log(height, this.props.lineHeight)
    var rows = Math.floor(height / this.props.lineHeight)

    console.log(cols, rows)

    this.term.resize(cols, rows)
  }
}

TerminalComponent.defaultProps = {
  lineHeight: 14
}

export default TerminalComponent
