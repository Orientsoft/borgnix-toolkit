import React from 'react'
import $ from 'jquery'
import ReactBs from 'react-bs'

var Nav = ReactBs.Nav
  , Navbar = ReactBs.Navbar
  , NavItem = ReactBs.NavItem
  , Button = ReactBs.Button

class AppNav extends React.Component {
  render() {
    return (
    <Navbar brand='Borgnix' toggleNavKey={2} fixedTop>
      <Nav right eventKey={2}>
        <NavItem eventKey={1} id='show-upload' onClick={function () {
          $('#upload-container').show()
          $('#debug-container').hide()
        }}>Upload</NavItem>
        <NavItem eventKey={2} id='show-debug' onClick={function () {
          $('#debug-container').show()
          $('#upload-container').hide()
        }}>Debug</NavItem>
      </Nav>
    </Navbar>
    )
  }
}

var navbarView = {
  init: function () {
    React.render(
      <AppNav />
    , $('#app-nav')[0]
    )
  }
}

export default navbarView
