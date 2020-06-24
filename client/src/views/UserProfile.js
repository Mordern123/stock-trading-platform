import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useHistory } from 'react-router'
import InputLabel from "@material-ui/core/InputLabel";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Card from "components/Card/Card.js";
import Table from "components/UserProfile/table.js";
import Profile from "components/UserProfile/profile.js";
import Chart from "components/UserProfile/chart.js";
import Avatar from "components/UserProfile/avatar.js";
import ProfileBox from "components/UserProfile/profileBox.js";
import {
  Typography,
  Paper,
  Box,
  Tab,
  Tabs,
  Button
} from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import { apiUser_get } from '../api'
import { check_status } from '../tools'

const barTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#454545",
    },
    secondary: {
      main: '#90CAF9',
    },
  },
});
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}
const styles = theme => ({
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "500",
    fontFamily: "'Noto Sans TC', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  customTab: {
    fontFamily: "'Noto Sans TC', sans-serif",
    "&:focus": {
      outline: "none"
    }
  },
  activeTab: {
    backgroundColor: "rgba(255, 207, 64, 1)",
  },
  customPaper: {
    width: '100%',
    minHeight: theme.spacing(50),
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'between',
    alignItem: 'center'
  }
});
const useStyles = makeStyles(styles);

export default function UserProfile() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0); //控制Panel轉換
  const [userData, setUserData] = useState(null);
  const history = useHistory()

  const handleOpen = () => {
    setOpen(true)
  };
  const handleClose = () => {
    setOpen(false)
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = index => {
    setValue(index);
  };

  const loadData = async() => {
    try {
      const res = await apiUser_get()
      setUserData(res.data)

      return true //提供更新個人資料狀態

    } catch (error) {
      const { need_login, msg } = check_status(error.response.status)
      alert(msg)
      if(need_login) {
        history.replace("/login", { need_login })
      }
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card profile>
            <Avatar />
            <ThemeProvider theme={barTheme}>
              <div className="mt-4">
                <h6 className={classes.cardCategory}>{userData ? userData.student_id : "---"}</h6>
                <h2 className={`${classes.cardTitleWhite} mb-3`}>{userData ? userData.user_name : "---"}</h2>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  className="m-0 p-0 mb-4"
                  onClick={handleOpen}
                >
                  修改
                </Button>
                <Tabs
                  value={value}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={handleChange}
                  variant="fullWidth"
                  aria-label="full width tabs example"
                  className={classes.customTabs}
                >
                  <Tab label="個人資料" className={`${classes.customTab} ${value == 0 ? classes.activeTab : null}`}/>
                  <Tab label="活動分析" className={`${classes.customTab} ${value == 1 ? classes.activeTab : null}`}/>
                  <Tab label="交易紀錄" className={`${classes.customTab} ${value == 2 ? classes.activeTab : null}`}/>
                </Tabs>
                <SwipeableViews
                  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={value}
                  onChangeIndex={handleChangeIndex}
                >
                  <TabPanel value={value} index={0} dir={theme.direction}>
                    <Paper elevation={2} className={classes.customPaper}>
                      {
                        userData ? (
                          <Profile
                            handleOpen={handleOpen}
                            userData={userData}
                          />
                        ) : null
                      }
                    </Paper>
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    <Paper elevation={2} className={classes.customPaper}>
                      <Chart />
                    </Paper>
                  </TabPanel>
                  <TabPanel value={value} index={2} dir={theme.direction}>
                    <Paper elevation={2} className={classes.customPaper}>
                      <Table />
                    </Paper>
                  </TabPanel>
                </SwipeableViews>
              </div>
            </ThemeProvider>
          </Card>
        </GridItem>
      </GridContainer>
      {
        userData
          ? (
            <ProfileBox
              open={open}
              handleClose={handleClose}
              userData={userData}
              loadData={loadData}
            />
          ) : null
      }
    </div>
  );
}
