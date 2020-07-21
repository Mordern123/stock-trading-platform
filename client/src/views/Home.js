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
import { apiClass_announceList } from '../api'
import { handle_error } from '../tools'
import moment from "moment";


const useStyles = makeStyles(theme => ({
  '@global': {
    '.ch_font': {
      fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
    },
  },
  media: {
    height: '300px'
  },
  linkCard: {
    height: '500px',
    [theme.breakpoints.down("md")]: {
      marginBottom: '30px'
    }
  }
}));

export const Home = function() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [updateTime, set_updateTime] = useState("")
  const [announceData, setAnnounceData] = useState([])
  const history = useHistory()

  React.useEffect(() => {
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
      if(res.data.length > 0) {
        let t = res.data[0].publish_date
        set_updateTime(moment(t).calendar(null, { lastWeek: 'dddd HH:mm', sameElse: 'LL' }))
        setAnnounceData(res.data)
      }

    } catch (error) {
      handle_error(error, history)
    }
  }
  
  const addSnack = () => {
    enqueueSnackbar("記得看課程公告喔", {
      variant :'info',
      anchorOrigin: { horizontal: 'right', vertical: 'top' },
      autoHideDuration: 1000,
      ContentProps: {
        style: {
          backgroundColor: "#ff9800",
          color: "white"
        },
        className: "ch_font",
      },
    })
  }

  return (
    <Fragment>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Announcement collection={announceData} updateTime={updateTime}/>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card className={classes.linkCard}>
            <CardActionArea href="https://www.twse.com.tw/zh/" target="_blank" style={{ textDecoration: 'none'}}>
              <CardMedia
                className={classes.media}
                image="https://news.idea-show.com/wp-content/uploads/2018/05/%E8%87%BA%E7%81%A3%E8%AD%89%E5%88%B8%E4%BA%A4%E6%98%93%E6%89%80.jpg"
                title="台灣股票證券交易所"
              />
              <CardContent>
                <Typography className="ch_font" gutterBottom variant="h5" component="h2">
                  台灣股票證券交易所
                </Typography>
                <Typography className="ch_font" variant="body2" color="textSecondary" component="p">
                  簡稱臺證所或證交所，為臺灣證券集中交易市場的經營機構，由臺灣證券交易所股份有限公司持有，座落於臺北101大樓內。其加權股價指數為自行編製的加權指數，被視為是臺灣經濟走向的主要指標之一
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card className={classes.linkCard}>
            <CardActionArea href="https://www.cnyes.com/" target="_blank" style={{ textDecoration: 'none'}}>
              <CardMedia
                className={classes.media}
                image="https://www.vocalmiddle.com/wp-content/uploads/2019/01/logo-cn-yes-1.png"
                title="鉅亨網"
              />
              <CardContent>
                <Typography className="ch_font" gutterBottom variant="h5" component="h2">
                  鉅亨網
                </Typography>
                <Typography className="ch_font" variant="body2" color="textSecondary" component="p">
                  我們相信每一個人都該有機會透過投資理財讓生活變得更美好，anue鉅亨集團立志成為投資人信賴的夥伴，我們運用科技協助投資人即時獲得金融市場脈動，並做出精準投資決策。anue鉅亨集團目前在台灣與香港皆有服務
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card className={classes.linkCard}>
            <CardActionArea href="https://tw.stock.yahoo.com/" target="_blank" style={{ textDecoration: 'none'}}>
              <CardMedia
                className={classes.media}
                image="https://lh3.googleusercontent.com/aAoFwOAPrrsLOOhu1XCmEVBmw5_FQgGLCRxRHHZwvSV_M_KKDQI3ZKJtBZpNWBrWMO8"
                title="Yahoo股市"
              />
              <CardContent>
                <Typography className="ch_font" gutterBottom variant="h5" component="h2">
                  Yahoo股市
                </Typography>
                <Typography className="ch_font" variant="body2" color="textSecondary" component="p">
                  Yahoo奇摩是台灣入口網站之一，為Verizon Media旗下入口網站雅虎的台灣版，由香港商雅虎資訊股份有限公司台灣分公司代表Verizon Media台灣公司營運
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card className="mt-5">
            <CardMedia
              className={classes.media}
              image="https://knowledge.wharton.upenn.edu/wp-content/uploads/2017/03/Stock-market.jpg"
              title="股票相關教學"
            />
            <CardContent>
              <Typography className="ch_font" gutterBottom variant="h5" component="h2">
                課程相關連結
              </Typography>
              <Button className="ch_font" size="large" color="primary" href="https://www.cmoney.tw/learn/" target="_blank" style={{ textDecoration: 'none'}}>
                CMoney 投資小學堂
              </Button>
            </CardContent>
          </Card>
        </GridItem>
      </GridContainer>
    </Fragment>
  );
}
