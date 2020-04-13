import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from "@material-ui/core/styles";
import {  Divider } from '@material-ui/core';
// import Card from "components/Card/Card.js";
// import CardHeader from "components/Card/CardHeader.js";
// import CardBody from "components/Card/CardBody.js";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Card,
  CardHeader,
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Button
} from '@material-ui/core';

const styles = theme => ({
  title: {
    color: theme.palette.warning.dark,
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Noto Sans TC', sans-serif",
    marginBottom: "0",
    textDecoration: "none",
  },
  subTitle: {
    fontFamily: "'Noto Sans TC', sans-serif",
    color: theme.palette.text.secondary,
    marginLeft: "10px",
    fontSize: "16px",
    marginTop: "0",
    marginBottom: "0",
  },
  customPanel: {
    boxShadow: 'none',
  },
  customPanel_Ex: {
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.3)',
  },
  customPanelContent: {
    marginBottom: '0 !important',
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
    textAlign: 'right'
  },
  publisher: {
    fontFamily: "'Noto Sans TC', sans-serif",
    color: theme.palette.text.secondary,
    fontSize: theme.typography.pxToRem(15),
    textAlign: 'right'
  },
  media: {
    height: 200,
  },
})

const useStyles = makeStyles(styles);

function Announcement(props) {
  const { collection } = props
  const classes = useStyles();
  return (
    <Card className="mb-5" raised>
        <CardMedia
          className={classes.media}
          image="https://static-cdn.123rf.com/images/v5/featured/tech_visual_ai.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <div className="ml-2 mt-1 mb-3 row align-items-end">
            <h1 className={classes.title}>課程公告</h1>
            <p className={classes.subTitle}>
              最新更新時間
            </p>
          </div>
          {
          collection.map((data, key) => {
            const publish_date = new Date(data.publish_date)
            return (
              <ExpansionPanel key={key} className={classes.customPanel} classes={{expanded: classes.customPanel_Ex}}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  classes={{content: classes.customPanelContent}}
                >
                  <div className="d-flex row flex-column w-100 align-content-center justify-content-center">
                    <div className="col-8">
                      <Typography className={classes.heading}>{data.title}</Typography>
                      <Typography className={classes.secondaryHeading}>{data.subTitle}</Typography>
                    </div>
                    <div className="col-4">
                      <Typography className={classes.subHeading}>{publish_date.toLocaleString()}</Typography>
                      <Typography className={classes.publisher}>{data.publisher.user_name}</Typography>
                    </div>
                  </div>
                  
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography>{data.content}</Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )
          })
        }
        </CardContent>
    </Card>
    // <Card>
      // <CardHeader color="primary">
      //   <h4 className={classes.title}>課程公告</h4>
      //   <p className={classes.subTitle}>
      //     最新更新時間
      //   </p>
      // </CardHeader>
    //   <CardBody>
    //     {
    //       collection.map((data, key) => {
    //         const publish_date = new Date(data.publish_date)
    //         return (
    //           <ExpansionPanel key={key} className={classes.customPanel} classes={{expanded: classes.customPanel_Ex}}>
    //             <ExpansionPanelSummary
    //               expandIcon={<ExpandMoreIcon />}
    //               classes={{content: classes.customPanelContent}}
    //             >
    //               <div className="d-flex row flex-column w-100 align-content-center justify-content-center">
    //                 <div className="col-8">
    //                   <Typography className={classes.heading}>{data.title}</Typography>
    //                   <Typography className={classes.secondaryHeading}>{data.subTitle}</Typography>
    //                 </div>
    //                 <div className="col-4">
    //                   <Typography className={classes.subHeading}>{publish_date.toLocaleString()}</Typography>
    //                   <Typography className={classes.publisher}>{data.publisher.user_name}</Typography>
    //                 </div>
    //               </div>
                  
    //             </ExpansionPanelSummary>
    //             <ExpansionPanelDetails>
    //               <Typography>{data.content}</Typography>
    //             </ExpansionPanelDetails>
    //           </ExpansionPanel>
    //         )
    //       })
    //     }
        
    //   </CardBody>
    // </Card>
  )
}

Announcement.propTypes = {
  collection: PropTypes.array
}

export default Announcement

