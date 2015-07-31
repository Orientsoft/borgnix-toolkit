import React from 'react'
import MIconButton from './material-icon-button'
import ThemeManager from './theme'
import {IconMenu} from 'material-ui'
import MenuItem from 'material-ui/lib/menus/menu-item'
import $ from 'jquery'
import path from 'path'

class FileSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filename: 'No File Selected'
    }
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <IconMenu
            iconButtonElement={<MIconButton icon='add' />}
            openDirection='bottom-right'>
          <MenuItem
              primaryText='Local File'
              onTouchTap={function(){
                $(React.findDOMNode(this.refs.input)).click()
              }.bind(this)}/>
          <MenuItem primaryText='Cloud File' />
        </IconMenu>
        <span className='label'>{'File: ' + path.basename(this.state.filename)}</span>
        <input type='file' ref='input' style={{display: 'none'}} accept='.hex'
            onChange={(e)=>{
              this.setState({
                filename: e.target.value
              })
            }}/>
      </div>
    )
  }

  getValue() {
    return this.state.filename
  }
}

FileSelect.childContextTypes = {
  muiTheme: React.PropTypes.object
}

FileSelect.propTypes = {

}

FileSelect.defaultProps = {

}

export default FileSelect
