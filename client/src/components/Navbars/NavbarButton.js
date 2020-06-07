import React from 'react'
import PropTypes from 'prop-types'
import Button from '../CustomButtons/Button'
import { useHistory } from 'react-router'
import { apiUser_logout } from '../../api'

function NavbarButton(props) {
  const history = useHistory()
  
  const logout = async() => {
    await apiUser_logout()
    history.replace("/login")
  }

  return (
    <div className="mr-3">
      <Button
        color="danger"
        size="sm"
        onClick={logout}
      >
        登出
      </Button>
    </div>
  )
}

NavbarButton.propTypes = {

}

export default NavbarButton

