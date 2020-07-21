import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { SnackbarProvider } from 'notistack';
import { check_cookie } from './tools'
import FileCopyRoundedIcon from '@material-ui/icons/FileCopyRounded';

function PrivateRoute(props) {
  const { path, component: Component, ...rest } = props
  const user_token = check_cookie('user_token')
  if(user_token) {
    return (
      <SnackbarProvider
        iconVariant={{
          copy: <FileCopyRoundedIcon className="mr-3"/>
        }}
        maxSnack={5}
      >
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

