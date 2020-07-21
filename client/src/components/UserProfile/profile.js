import React from "react";
// @material-ui/core
import { List, ListItem, ListItemIcon, ListItemText, Grid } from '@material-ui/core'
import FingerprintRoundedIcon from '@material-ui/icons/FingerprintRounded';
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import AccountBoxRoundedIcon from '@material-ui/icons/AccountBoxRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import WcRoundedIcon from '@material-ui/icons/WcRounded';
import CakeRoundedIcon from '@material-ui/icons/CakeRounded';
import UpdateRoundedIcon from '@material-ui/icons/UpdateRounded';
import EventAvailableRoundedIcon from '@material-ui/icons/EventAvailableRounded';
import moment from 'moment'
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    [theme.breakpoints.up("md")]: {
      marginLeft: '3rem'
    }
  },
  text: {
    "& span, & p, & div": {
      fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif !important"
    }
  }
}))

export default function Profile(props) {
  const classes = useStyles();
  const { userData } = props
  const { _id, student_id, sex, birthday, user_name, email, createdAt, updatedAt } = userData
  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} sm={12} md={6} className="d-flex align-items-center">
        <List>
          <ListItem className="mb-2">
            <ListItemIcon>
              <FingerprintRoundedIcon fontSize="large"/>
            </ListItemIcon>
            <ListItemText
              className={classes.text}
              primary="用戶ID"
              secondary={_id}
            />
          </ListItem>
          <ListItem className="mb-2">
            <ListItemIcon>
              <StarRoundedIcon fontSize="large"/>
            </ListItemIcon>
            <ListItemText
              className={classes.text}
              primary="學號"
              secondary={student_id}
            />
          </ListItem>
          <ListItem className="mb-2">
            <ListItemIcon>
              <AccountBoxRoundedIcon fontSize="large"/>
            </ListItemIcon>
            <ListItemText
              primary="姓名"
              secondary={user_name}
              className={classes.text}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MailOutlineRoundedIcon fontSize="large"/>
            </ListItemIcon>
            <ListItemText
              primary="用戶信箱"
              secondary={email || '未設定'}
              className={classes.text}
            />
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12} sm={12} md={6} className="d-flex align-items-center">
        <List>
          <ListItem className="mb-2">
            <ListItemIcon>
              <WcRoundedIcon fontSize="large"/>
            </ListItemIcon>
            <ListItemText
              primary="性別"
              secondary={sex || '未設定'}
              className={classes.text}
            />
          </ListItem>
          <ListItem className="mb-2">
            <ListItemIcon>
              <CakeRoundedIcon fontSize="large"/>
            </ListItemIcon>
            <ListItemText
              primary="生日"
              secondary={moment(birthday).format("YYYY-MM-DD") || '未設定'}
              className={classes.text}
            />
          </ListItem>
          <ListItem className="mb-2">
            <ListItemIcon>
              <UpdateRoundedIcon fontSize="large"/>
            </ListItemIcon>
            <ListItemText
              primary="最後更新日期"
              secondary={updatedAt}
              className={classes.text}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EventAvailableRoundedIcon fontSize="large"/>
            </ListItemIcon>
            <ListItemText
              primary="帳號創建日期"
              secondary={createdAt}
              className={classes.text}
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  )
}