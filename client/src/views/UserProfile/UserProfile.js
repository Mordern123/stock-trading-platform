import React from "react";
// @material-ui/core components
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
// @material-ui/core
import {
  Avatar,
  Badge,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Typography,
  IconButton,
  AppBar,
  Box,
  Tab,
  Tabs,
} from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import {
  Close
} from '@material-ui/icons'
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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const StyledBadge = withStyles(theme => ({
  badge: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: '50%',
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(1.8)',
      opacity: 0,
    },
  },
}))(Badge);
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
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
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  inputLabel: {
    display: 'flex',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  customTypo: {
    fontFamily: "'Noto Sans TC', sans-serif",
    color: "rgba(68,68,68,0.9)",
    fontSize: '1.5rem'
  },
  fontFamily: {
    fontFamily: "'Noto Sans TC', sans-serif",
  },
  customTabs: {
  },
  customTab: {
    fontFamily: "'Noto Sans TC', sans-serif",
    "&:focus": {
      outline: "none"
    }
  },
  activeTab: {
    backgroundColor: "rgba(255, 207, 64, 1)",
  }
});
const useStyles = makeStyles(styles);
export default function UserProfile() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
            <CardAvatar profile>
              <StyledBadge
                overlap="circle"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                variant="dot"
              >
                <Avatar className={classes.avatar}/>
              </StyledBadge>
            </CardAvatar>
            <ThemeProvider theme={barTheme}>
              <div className="mt-4">
                <h6 className={classes.cardCategory}>7108026107</h6>
                <h2 className={`${classes.cardTitleWhite} mb-4`}>胡紘維</h2>
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
                    Item One
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    Item Two
                  </TabPanel>
                  <TabPanel value={value} index={2} dir={theme.direction}>
                    Item Three
                  </TabPanel>
                </SwipeableViews>
              </div>
            </ThemeProvider>
            <Button color="primary" round onClick={() => handleClickOpen()}>
              Follow
            </Button>
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
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle>
          <Typography variant="h6" className={classes.customTypo}>編輯個人資料</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            更新
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
