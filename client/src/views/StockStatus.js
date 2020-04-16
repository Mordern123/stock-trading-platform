import React, {useState} from "react";
import clsx from 'clsx';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { Paper, Tabs, Tab, Typography, Box } from "@material-ui/core";
import SwipeableViews from 'react-swipeable-views';
import Material_Table from "components/Table/Material_Table";

const table_state = {
  columns: [
    { title: 'Name', field: 'name' },
    { title: 'Surname', field: 'surname' },
    { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
    {
      title: 'Birth Place',
      field: 'birthCity',
      lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
    },
  ],
  data: [
    { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
    { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
    { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
    { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
    { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
    { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
    { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
    { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
  ],
}

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
  const getTabBarStyles = (current_i) => {
    if(current_i==0) return classes.customTabs_success
    else if(current_i==1) return classes.customTabs_wait
    else if(current_i==2) return classes.customTabs_error
  }
  const getTabStyles = (current_i, i) => {
    if(i==0 && current_i == i) return classes.tabRoot_success
    else if(i==1 && current_i == i) return classes.tabRoot_wait
    else if(i==2 && current_i == i) return classes.tabRoot_fail
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
            className={getTabBarStyles(value)}
          >
            <Tab label="成功交易" className={clsx(classes.customTab, getTabStyles(value, 0))} />
            <Tab label="等待交易" className={clsx(classes.customTab, getTabStyles(value, 1))} />
            <Tab label="失敗交易" className={clsx(classes.customTab, getTabStyles(value, 2))} />
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
                columns={table_state.columns}
                data={table_state.data}
                noContainer
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <Material_Table
                title="顯示所有未完成交易紀錄"
                showToolBar
                search
                columns={table_state.columns}
                data={table_state.data}
                noContainer
              />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <Material_Table
                title="顯示所有失敗交易紀錄"
                showToolBar
                search
                columns={table_state.columns}
                data={table_state.data}
                noContainer
              />
            </TabPanel>
          </SwipeableViews>
        </Paper>
      </GridItem>
    </GridContainer>
  )
}