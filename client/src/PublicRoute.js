import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { check_cookie } from './tools'

function PublicRoute(props) {
  const { path, component: Component, ...rest } = props
  const user_token = check_cookie('user_token')
  
  if(user_token) {
    return <Redirect to='/admin' />
  } else {
    return (
      <Route
        {...rest}
        path={path}
        render={(props) => (
          <Component {...props}/> 
        )}
      />
    )
  }
}

PublicRoute.propTypes = {

}

export default PublicRoute

