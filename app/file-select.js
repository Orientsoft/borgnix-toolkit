import React from 'react'
import MIconButton from './material-icon-button'
import ThemeManager from './theme'
import {IconMenu} from 'material-ui'
import MenuItem from 'material-ui/lib/menus/menu-item'
import $ from 'jquery'
import path from 'path'
import BPM from 'borgnix-project-manager/client-node'
import {borgnixJar} from './cookie-jar'
import pubsub from 'pubsub-js'

let bpm = new BPM({
  host: 'http://voyager.orientsoft.cn'
, prefix: '/arduino/p'
, jar: borgnixJar
})

class FileSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filename: this.props.filename
    , hexFiles: []
    , type: 'local'
    }
  }

  componentDidMount() {
    let self = this
    pubsub.subscribe('select_cloud_file', (topic, file)=>{
      console.log('file select got', file)
      self.setState({filename: file})
    })
    bpm.listProject({type: 'arduino'}, function (res) {
      console.log(res)
      self.setState({
        hexFiles: res.map((project)=>{
          return project.name + '.hex'
        })
      })
    })
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  render() {
    let self = this
    return (
      <div style={{display: 'inline-block'}}>
        <IconMenu
            iconButtonElement={<MIconButton icon='add' />}
            openDirection='bottom-right'>
          <MenuItem
              primaryText='Local File'
              onTouchTap={function(){
                this.setState({
                  type: 'local'
                })
                $(React.findDOMNode(this.refs.input)).click()
              }.bind(this)}/>
          <MenuItem
              primaryText='Cloud File'
              onTouchTap={()=>{
                this.setState({
                  type: 'remote'
                })
                bpm.listProject({type: 'arduino'}, function (res) {
                  console.log(res)
                  self.setState({
                    hexFiles: res.map((project)=>{
                      return project.name + '.hex'
                    })
                  })
                  pubsub.publish('show_cloud_files', res.map((project)=>{
                    return project.name + '.hex'
                  }))
                })
              }}/>

        </IconMenu>
        <span className='label'>{'File: ' + path.basename(this.state.filename)}</span>
        <input type='file' ref='input' style={{display: 'none'}} accept='.hex'
            onChange={(e)=>{
              this.setState({
                filename: e.target.value
              })
              pubsub.publish('select_local_file')
            }}/>
      </div>
    )
  }

  getValue() {
    return this.state.filename
  }

  getType() {
    return this.state.type
  }
}

FileSelect.childContextTypes = {
  muiTheme: React.PropTypes.object
}

FileSelect.propTypes = {
  filename: React.PropTypes.string
}

FileSelect.defaultProps = {
  filename: 'No File Selected'
}

export default FileSelect
