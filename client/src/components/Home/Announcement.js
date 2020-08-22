import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";
// import Card from "components/Card/Card.js";
// import CardHeader from "components/Card/CardHeader.js";
// import CardBody from "components/Card/CardBody.js";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Hidden from "@material-ui/core/Hidden";
import {
	Card,
	CardHeader,
	CardActions,
	CardActionArea,
	CardContent,
	CardMedia,
	Typography,
	Button,
} from "@material-ui/core";
import clsx from "clsx";

const styles = (theme) => ({
	title: {
		color: theme.palette.warning.dark,
		minHeight: "auto",
		fontWeight: "300",
		fontFamily: "'Noto Sans TC', sans-serif",
		marginBottom: "0",
		textDecoration: "none",
		marginRight: "10px",
	},
	subTitle: {
		fontFamily: "'Noto Sans TC', sans-serif",
		color: theme.palette.text.secondary,
		fontSize: "16px",
		marginTop: "0",
		marginBottom: "0",
	},
	customPanel: {
		boxShadow: "none",
	},
	customPanel_Ex: {
		boxShadow: "0px 1px 5px 0px rgba(0,0,0,0.3)",
	},
	customPanelContent: {
		marginBottom: "0 !important",
	},
	heading: {
		fontFamily: "'Noto Sans TC', sans-serif",
		color: theme.palette.text.primary,
		fontSize: theme.typography.pxToRem(20),
	},
	secondaryHeading: {
		fontFamily: "'Noto Sans TC', sans-serif",
		color: theme.palette.action.active,
		fontSize: theme.typography.pxToRem(15),
	},
	subHeading: {
		fontFamily: "'Noto Sans TC', sans-serif",
		fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary,
		textAlign: "right",
	},
	publisher: {
		fontFamily: "'Noto Sans TC', sans-serif",
		color: theme.palette.text.secondary,
		fontSize: theme.typography.pxToRem(15),
		textAlign: "right",
	},
	media: {
		height: 200,
	},
});

const useStyles = makeStyles(styles);

function Announcement(props) {
	const { collection, updateTime } = props;
	const classes = useStyles();
	return (
		<Card className="mb-5" raised>
			<CardMedia
				className={classes.media}
				image="https://static-cdn.123rf.com/images/v5/featured/tech_visual_ai.jpg"
				title="課程公告"
			/>
			<CardContent>
				<div className="ml-2 mt-1 mb-3 row align-items-end">
					<h1 className={classes.title}>課程公告</h1>
					<p className={classes.subTitle}>{`最新公告時間: ${updateTime}`}</p>
				</div>
				{collection.map((data, key) => {
					const publish_date = new Date(data.publish_date);
					return (
						<ExpansionPanel
							key={key}
							className={clsx("pt-2 pb-3", classes.customPanel)}
							classes={{ expanded: classes.customPanel_Ex }}
						>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								classes={{ content: classes.customPanelContent }}
							>
								<div className="d-flex row w-100 align-content-center justify-content-between">
									<div className="col col-md-8">
										<Typography className={classes.heading}>
											{data.title}
										</Typography>
										<Typography className={classes.secondaryHeading}>
											{data.subTitle}
										</Typography>
									</div>
									<Hidden only={["md", "lg", "xl"]} implementation="css">
										<div className="d-flex align-items-center h-100">
											<Typography className={classes.publisher}>
												{data.publisher.user_name}
											</Typography>
										</div>
									</Hidden>
									<Hidden only={["xs", "sm"]} implementation="css">
										<div className="">
											<Typography className={classes.subHeading}>
												{publish_date.toLocaleString()}
											</Typography>
											<Typography className={classes.publisher}>
												{data.publisher.user_name}
											</Typography>
										</div>
									</Hidden>
								</div>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<div>
									{data.content
										? data.content.map((item, i) => (
												<Typography key={i} variant="subtitle1">
													{item}
												</Typography>
										  ))
										: null}
								</div>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					);
				})}
			</CardContent>
		</Card>
	);
}

Announcement.propTypes = {
	collection: PropTypes.array,
};

export default Announcement;
