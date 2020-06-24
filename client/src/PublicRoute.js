import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect, useLocation } from 'react-router-dom'
import { check_cookie } from './tools'

function PublicRoute(props) {
  const location = useLocation()
  const { path, component: Component, ...rest } = props
  const user_token = check_cookie('user_token')
  const { need_login } = location.state || {}

  console.log(location)

  //如果上個頁面傳送需要登入
  if(need_login) {
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
  
  //判斷是否以登入
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

