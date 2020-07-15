import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router'
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Announcement from "../components/Home/Announcement";
import { useSnackbar } from 'notistack';
import {
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Button
} from '@material-ui/core';
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { apiClass_announceList } from '../api'
import { handle_error } from '../tools'

const useStyles = makeStyles(styles);

export const Home = function() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [announceData, setAnnounceData] = useState([])
  const history = useHistory()

  useEffect(() => {
    getAnnounceData()
    const timeout= setTimeout(() => {
      addSnack()
    }, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const getAnnounceData = async() => {
    try {
      const res = await apiClass_announceList()
      setAnnounceData(res.data)

    } catch (error) {
      handle_error(error, history)
    }
  }
  
  const addSnack = () => {
    enqueueSnackbar("記得看課程公告喔", {
      variant :'info',
      anchorOrigin: { horizontal: 'right', vertical: 'top' },
      autoHideDuration: 2000
    })
  }

  return (
    <Fragment>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Announcement collection={announceData}/>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://static-cdn.123rf.com/images/v5/featured/tech_visual_ai.jpg"
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  提示
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                  across all continents except Antarctica
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                Share
              </Button>
              <Button size="small" color="primary">
                Learn More
              </Button>
            </CardActions>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://static-cdn.123rf.com/images/v5/featured/tech_visual_ai.jpg"
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  提示
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                  across all continents except Antarctica
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                Share
              </Button>
              <Button size="small" color="primary">
                Learn More
              </Button>
            </CardActions>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://static-cdn.123rf.com/images/v5/featured/tech_visual_ai.jpg"
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  提示
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                  across all continents except Antarctica
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                Share
              </Button>
              <Button size="small" color="primary">
                Learn More
              </Button>
            </CardActions>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card className="mt-5">
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://static-cdn.123rf.com/images/v5/featured/tech_visual_ai.jpg"
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  課程相關
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                  across all continents except Antarctica
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </GridItem>
      </GridContainer>
    </Fragment>
  );
}
