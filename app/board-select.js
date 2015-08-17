import React from 'react'
import {SelectField} from 'material-ui'
import ThemeManager from './theme'
import BAC from 'arduino-compiler/client-node'
import _ from 'underscore'
import {borgnixJar} from './cookie-jar'

class BoardSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      boards: []
    , selectedBoard: null
    , selectedIndex: 0
    }
  }

  componentDidMount() {
    let bac = new BAC({
      host: 'http://voyager.orientsoft.cn'
    , prefix: '/arudino/c'
    , jar: borgnixJar
    })
      , self = this

    bac.getBoardsOffline()

    bac.getBoardsOffline(function (err, res) {
      if (err) console.log(err.stack || err)
      console.log(res)
      let boards = _.map(res, (b, i)=>{
        if (b.signature)
          b.signature = new Buffer(b.signature, 'hex')
        b.id = i
        return b
      }).filter((board)=>{
        return board.signature
      })

      self.setState({
        boards: boards
      , selectedBoard: 'uno'
      })
    })
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  render() {
    return (
      <SelectField
        floatingLabelText='board'
        displayMember='name'
        valueMember='id'
        value={this.state.selectedBoard}
        menuItems={this.state.boards}
        onChange={this._handleSelectValueChange.bind(this, 'selectedBoard')}/>
    )
  }

  getSelectedBoard() {
    return _.find(this.state.boards, {id: this.state.selectedBoard})
  }

  _handleSelectValueChange(key, e) {
    console.log(this)
    var newState = {}
    newState[key] = e.target.value
    this.setState(newState)
  }
}

BoardSelect.childContextTypes = {
  muiTheme: React.PropTypes.object
}

BoardSelect.propTypes = {

}

BoardSelect.defaultProps = {

}

export default BoardSelect
