import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import AdminNavbarLinks from "./AdminNavbarLinks.js";
import Button from "components/CustomButtons/Button.js";
import NavbarButton from "./NavbarButton";
import styles from "assets/jss/material-dashboard-react/components/headerStyle.js";
import clsx from "clsx";
import "../../assets/css/global.css";

const useStyles = makeStyles(styles);

export default function Header(props) {
	const classes = useStyles();
	function makeBrand() {
		var name;
		props.routes.map((prop) => {
			if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
				name = props.rtlActive ? prop.rtlName : prop.name;
			}
			return null;
		});
		return name;
	}
	const { color } = props;
	const appBarClasses = classNames({
		[" " + classes[color]]: color,
	});
	return (
		<AppBar className={classes.appBar + appBarClasses}>
			<Toolbar className={clsx("d-flex justify-content-between", classes.container)}>
				{/* <div className={classes.flex}> */}
				{/* Here we create navbar brand, based on route name */}
				{/* <Button color="transparent" href="#" className={classes.title}>
            {makeBrand()}
          </Button> */}
				{/* </div> */}
				<Hidden smDown implementation="css">
					{/* <AdminNavbarLinks /> */}
				</Hidden>
				<Hidden mdUp implementation="css">
					{/* <Button variant="contained" color="primary" className="mr-3 w-100 h-100">
            Primary
          </Button> */}
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={props.handleDrawerToggle}
						style={{
							position: "fixed",
							top: "15px",
							backgroundColor: "rgba(242, 242, 242, 0.8)",
						}}
					>
						<Menu />
					</IconButton>
				</Hidden>
				<div
					className="ch_font w-100 d-flex align-items-center justify-content-center"
					style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "0.8rem" }}
				>
					👾每30分鐘會處理一次交易喔👾
				</div>
				<NavbarButton />
			</Toolbar>
		</AppBar>
	);
}

Header.propTypes = {
	color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
	rtlActive: PropTypes.bool,
	handleDrawerToggle: PropTypes.func,
	routes: PropTypes.arrayOf(PropTypes.object),
};
