import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { SnackbarProvider } from 'notistack';


function PrivateRoute(props) {
  const { path, component: Component, ...rest } = props
  const isAuthenticated = localStorage.getItem("isAuthenticated")
  
  return (
    isAuthenticated
      ? <SnackbarProvider maxSnack={5}>
          <Route
            {...rest}
            path={path}
            render={(props) => (
              <Component {...props} /> 
            )}
          />
        </SnackbarProvider>
      : <Redirect to='/login' />
  )
}

PrivateRoute.propTypes = {

}

export default PrivateRoute

