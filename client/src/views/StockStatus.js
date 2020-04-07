import React, {useState} from "react";
import clsx from 'clsx';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { Paper, Tabs, Tab, Typography, Box } from "@material-ui/core";
import SwipeableViews from 'react-swipeable-views';
import MUI_Table from 'components/Table/MUI_Table';
import Material_Table from "components/Table/Material_Table";


const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </Typography>
  );
}

const styles = theme => ({
  customTab: {
    fontFamily: "'Noto Sans TC', sans-serif",
    color: 'white',
    "&:focus": {
      outline: "none"
    }
  },
  customTabs_success: {
    color: 'white',
    backgroundColor: theme.palette.success.main,
  },
  customTabs_wait: {
    color: 'white',
    backgroundColor: theme.palette.info.main,
  },
  customTabs_error: {
    color: 'white',
    backgroundColor: theme.palette.error.main,
  },
  tabRoot_success: {
    backgroundColor: theme.palette.success.dark,
  },
  tabRoot_wait: {
    backgroundColor: theme.palette.info.dark,
    fontFamily: "'Noto Sans TC', sans-serif",
  },
  tabRoot_fail: {
    backgroundColor: theme.palette.error.dark,
  },
  indicator: {
    opacity: 0,
    // backgroundColor: 'black'
  },
})

const useStyles = makeStyles(styles);

export default function StockStatus() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const getTabStyles = (i) => {
    if(i==0) return classes.customTabs_success
    else if(i==1) return classes.customTabs_wait
    else if(i==2) return classes.customTabs_error
  }
  console.log(classes.customTabs)
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Paper elevation={5}>
          <Tabs
            value={value}
            onChange={handleChange}
            classes={{indicator: classes.indicator}}
            className={getTabStyles(value)}
          >
            <Tab label="成功交易" className={classes.customTab} classes={value == 0 && {root: classes.tabRoot_success}} />
            <Tab label="等待交易" className={classes.customTab} classes={value == 1 && {root: classes.tabRoot_wait}} />
            <Tab label="失敗交易" className={classes.customTab} classes={value == 2 && {root: classes.tabRoot_fail}} />
          </Tabs>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChange}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <Material_Table
                title="顯示所有交易紀錄"
                showToolBar
                search
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <Material_Table
                title="顯示所有未完成交易紀錄"
                showToolBar
                search
              />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <Material_Table
                title="顯示所有失敗交易紀錄"
                showToolBar
                search
              />
            </TabPanel>
          </SwipeableViews>
        </Paper>
      </GridItem>
    </GridContainer>
  )
}