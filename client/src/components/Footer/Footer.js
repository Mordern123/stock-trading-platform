/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import "../../assets/css/global.css";
import clsx from "clsx";
// core components
import styles from "assets/jss/material-dashboard-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
	const classes = useStyles();
	return (
		<footer className={classes.footer}>
			<div className={clsx("ch_font mb-5", classes.container)}>
				<div className={classes.left}>
					<b>eeric55tw@gmail.com</b>
					<p>有任何問題歡迎聯絡✌</p>
					{/* <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="#home" className={classes.block}>
                Home
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#company" className={classes.block}>
                Company
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#portfolio" className={classes.block}>
                Portfolio
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#blog" className={classes.block}>
                Blog
              </a>
            </ListItem>
          </List> */}
				</div>
				<p className={classes.right}>
					<span>
						<a
							href="https://github.com/hongwei0417"
							target="_blank"
							className={classes.a}
						>
							&copy;Hongwei 製作
						</a>
					</span>
				</p>
			</div>
		</footer>
	);
}
