import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import Login from "layouts/Login.js";


function PublicRoute(props) {
  const { path, component: Component, ...rest } = props

  const isAuthenticated = localStorage.getItem("isAuthenticated")

  return (
    isAuthenticated
      ? <Redirect to='/admin' />
      : <Route
          {...rest}
          path={path}
          render={(props) => (
            <Component {...props}/> 
          )}
        />
  )
}

PublicRoute.propTypes = {

}

export default PublicRoute

