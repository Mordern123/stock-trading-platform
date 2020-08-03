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
import logo from "assets/img/dock3.gif";
import { apiClass_get_online } from "../../api";
import "../../assets/css/global.css";

const useStyles = makeStyles(styles);

export default function Header(props) {
	const classes = useStyles();
	const [online, set_online] = React.useState("---");
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

	const update_online = async () => {
		let res = await apiClass_get_online();
		set_online(res.data);
	};

	React.useEffect(() => {
		const interval = setInterval(async () => {
			update_online();
		}, 1000 * 10);

		return () => clearInterval(interval);
	}, [online]);

	React.useEffect(() => {
		update_online();
	}, []);

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
					{/* 👾每30分鐘會處理一次交易喔👾 */}
					<img src={logo} style={{ width: "30px" }} />
					{`目前有 ${online} 個人在線上喔`}
					<img src={logo} style={{ width: "30px" }} />
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
