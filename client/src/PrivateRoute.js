import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { SnackbarProvider } from 'notistack';
import { check_cookie } from './tools'

function PrivateRoute(props) {
  const { path, component: Component, ...rest } = props
  const user_token = check_cookie('user_token')
  if(user_token) {
    return (
      <SnackbarProvider maxSnack={5}>
        <Route
          {...rest}
          path={path}
          render={(props) => (
            <Component {...props} /> 
          )}
        />
      </SnackbarProvider>
    )
  } else {
    return <Redirect to='/login' />
  }
}

PrivateRoute.propTypes = {

}

export default PrivateRoute

