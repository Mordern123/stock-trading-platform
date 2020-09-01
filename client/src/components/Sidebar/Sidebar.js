/*eslint-disable*/
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import clsx from "clsx";
// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";

import styles from "assets/jss/material-dashboard-react/components/sidebarStyle.js";

const useStyles = makeStyles(styles);

export default function Sidebar({
	color,
	logo,
	image,
	logoText,
	routes,
	closing,
	open,
	handleDrawerToggle,
	rtlActive,
}) {
	const classes = useStyles();
	// verifies if routeName is the one active (in browser input)
	function activeRoute(routeName) {
		return window.location.href.indexOf(routeName) > -1 ? true : false;
	}
	const [drawerOpen, set_drawerOpen] = React.useState(false); //drawerOpen狀態

	const closeDrawer = () => {
		if (open) handleDrawerToggle();
		if (drawerOpen) set_drawerOpen(false);
	};

	var links = (
		<List className={classes.list}>
			{routes.map((prop, key) => {
				var activePro = " ";
				var listItemClasses;
				if (prop.path === "/upgrade-to-pro") {
					activePro = classes.activePro + " ";
					listItemClasses = classNames({
						[" " + classes[color]]: true,
					});
				} else {
					listItemClasses = classNames({
						[" " + classes[color]]: activeRoute(prop.layout + prop.path),
					});
				}
				const whiteFontClasses = classNames({
					[" " + classes.whiteFont]: activeRoute(prop.layout + prop.path),
				});
				return (
					<NavLink
						onClick={closeDrawer}
						to={prop.layout + prop.path}
						className={activePro + classes.item}
						activeClassName="active"
						key={key}
					>
						<ListItem button className={classes.itemLink + listItemClasses}>
							{typeof prop.icon === "string" ? (
								<Icon
									className={classNames(classes.itemIcon, whiteFontClasses, {
										[classes.itemIconRTL]: rtlActive,
									})}
								>
									{prop.icon}
								</Icon>
							) : (
								<prop.icon
									className={classNames(classes.itemIcon, whiteFontClasses, {
										[classes.itemIconRTL]: rtlActive,
									})}
								/>
							)}
							<ListItemText
								primary={rtlActive ? prop.rtlName : prop.name}
								className={classNames(classes.itemText, whiteFontClasses, {
									[classes.itemTextRTL]: rtlActive,
								})}
								disableTypography={true}
							/>
						</ListItem>
					</NavLink>
				);
			})}
		</List>
	);
	var brand = (
		<div className={classes.logo}>
			<div
				className={classNames(
					classes.logoLink,
					{
						[classes.logoLinkRTL]: rtlActive,
					},
					"d-flex flex-row align-items-center"
				)}
				target="_blank"
			>
				<div className={classes.logoImage}>
					<img src={logo} alt="logo" className={classes.img} />
				</div>
				<div>
					<div>{logoText}</div>
					<div
						className="ch_font text-center"
						style={{
							fontSize: "0.9rem",
							color: closing ? "#81c784" : "#e57373",
							marginTop: "-5px",
						}}
					>
						{closing ? "收盤中" : "開盤中"}
					</div>
				</div>
			</div>
		</div>
	);

	React.useEffect(() => {
		set_drawerOpen(open);
	}, [open]);

	return (
		<div>
			<Hidden mdUp implementation="css">
				<SwipeableDrawer
					variant="temporary"
					anchor={rtlActive ? "left" : "left"}
					open={drawerOpen}
					onOpen={() => set_drawerOpen(true)}
					onClose={closeDrawer}
					classes={{
						paper: classNames(classes.drawerPaper, {
							[classes.drawerPaperRTL]: rtlActive,
						}),
					}}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
				>
					{brand}
					<div className={classes.sidebarWrapper}>
						{/* {props.rtlActive ? <RTLNavbarLinks /> : <AdminNavbarLinks />} */}
						{links}
					</div>
					{image !== undefined ? (
						<div
							className={classes.background}
							style={{ backgroundImage: "url(" + image + ")" }}
						/>
					) : null}
				</SwipeableDrawer>
			</Hidden>
			<Hidden smDown implementation="css">
				<Drawer
					anchor={rtlActive ? "right" : "left"}
					variant="permanent"
					open
					classes={{
						paper: classNames(classes.drawerPaper, {
							[classes.drawerPaperRTL]: rtlActive,
						}),
					}}
				>
					{brand}
					<div className={classes.sidebarWrapper}>{links}</div>
					{image !== undefined ? (
						<div
							className={classes.background}
							style={{ backgroundImage: "url(" + image + ")" }}
						/>
					) : null}
				</Drawer>
			</Hidden>
		</div>
	);
}

Sidebar.propTypes = {
	rtlActive: PropTypes.bool,
	handleDrawerToggle: PropTypes.func,
	bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
	logo: PropTypes.string,
	image: PropTypes.string,
	logoText: PropTypes.string,
	routes: PropTypes.arrayOf(PropTypes.object),
	open: PropTypes.bool,
};
