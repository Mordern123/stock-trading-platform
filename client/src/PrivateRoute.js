import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'

function PrivateRoute(props) {
  const { path, component: Component, ...rest } = props
  
  const isAuthenticated = localStorage.getItem("isAuthenticated")
  
  return (
    isAuthenticated
      ? <Route
          path={path}
          render={(props) => (
            <Component {...props}/> 
          )}
        />
      : <Redirect to='/login' />
  )
}

PrivateRoute.propTypes = {

}

export default PrivateRoute

