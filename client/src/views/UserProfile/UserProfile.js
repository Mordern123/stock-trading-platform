import React, { useState } from "react";
// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
// import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Table from "components/UserProfile/table.js";
import Profile from "components/UserProfile/profile.js";
import Chart from "components/UserProfile/chart.js";
import Avatar from "components/UserProfile/avatar.js";
import ProfileBox from "components/UserProfile/profileBox.js";
// @material-ui/core
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
// others
import SwipeableViews from 'react-swipeable-views';
import avatar from "assets/img/faces/marc.jpg";

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
  const [value, setValue] = useState(0);
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
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card profile>
            <Avatar />
            <ThemeProvider theme={barTheme}>
              <div className="mt-4">
                <h6 className={classes.cardCategory}>7108026107</h6>
                <h2 className={`${classes.cardTitleWhite} mb-3`}>胡紘維</h2>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  className="m-0 p-0 mb-4"
                  onClick={handleOpen}
                >EDIT</Button>
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
                    <Paper elevation={3} className={classes.customPaper}>
                      <Profile handleOpen={handleOpen}/>
                    </Paper>
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    <Paper elevation={3} className={classes.customPaper}>
                      <Chart />
                    </Paper>
                  </TabPanel>
                  <TabPanel value={value} index={2} dir={theme.direction}>
                    <Paper elevation={3} className={classes.customPaper}>
                      <Table />
                    </Paper>
                  </TabPanel>
                </SwipeableViews>
              </div>
            </ThemeProvider>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={5}>
                  <CustomInput
                    labelText="Company (disabled)"
                    id="company-disabled"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="Username"
                    id="username"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Email address"
                    id="email-address"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="First Name"
                    id="first-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Last Name"
                    id="last-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="City"
                    id="city"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Country"
                    id="country"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Postal Code"
                    id="postal-code"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <InputLabel style={{ color: "#AAAAAA" }}>About me</InputLabel>
                  <CustomInput
                    labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                    id="about-me"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 5
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary">Update Profile</Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>CEO / CO-FOUNDER</h6>
              <h4 className={classes.cardTitle}>Alec Thompson</h4>
              <p className={classes.description}>
                Don{"'"}t be scared of the truth because we need to restart the
                human foundation in truth And I love you like Kanye loves Kanye
                I love Rick Owens’ bed design but the back is...
              </p>
              <Button color="primary" round>
                Follow
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <ProfileBox open={open} handleClose={handleClose}/>
    </div>
  );
}
