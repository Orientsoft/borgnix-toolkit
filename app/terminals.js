import Terminal from './terminal'
import React from 'react'
import _ from 'underscore'

class Terminals extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      terminals: this.props.terms
    , activeTerm: this.props.terms[0] || {}
    }
  }

  render() {
    let self = this
    return (
      <div onContextMenu={this.props.onContextMenu}>
        {
          this.state.terminals.map((term)=>{
            let display = {display: (self.state.activeTerm.id === term.id ? 'block' : 'none')}
            return (
              <Terminal
                 id={term.id}
                 ref={'term_' + term.id}
                 style={_.extend(display, self.props.style)}
                 lineHeight={self.props.lineHeight}/>
            )
          })
        }
      </div>
    )
  }

  add(opts) {
    this.setState({
      terminals: this.state.terminals.concat([opts])
    })
  }

  delete(id) {
    this.setState({
      terminals: this.state.terminals.filter((term)=> {
        return term.id !== id
      })
    })
  }
}

Terminals.propTypes = {
  onContextMenu: React.PropTypes.func
, terms: React.PropTypes.array
}

Terminals.defaultProps = {
  terms: []
}

export default Terminals
