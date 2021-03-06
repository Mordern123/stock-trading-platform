import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { BrowserRouter, Route, Switch, Redirect, HashRouter } from "react-router-dom";
import Admin from "layouts/Admin.js";
import Login from "layouts/Login.js";
import SignUp from "layouts/SignUp.js";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import "./globalChart";
import "assets/css/material-dashboard-react.css?v=1.8.0";
import "assets/css/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";

const hist = createBrowserHistory();

ReactDOM.render(
	<BrowserRouter>
		<Switch>
			<PublicRoute path="/signup" component={SignUp} />
			<PublicRoute path="/login" component={Login} />
			<PrivateRoute path="/admin" component={Admin} />
			<Redirect from="/" to="/login" />
		</Switch>
	</BrowserRouter>,
	document.getElementById("root")
);
