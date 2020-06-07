import React, { useState, useEffect, useCallback } from "react";
import clsx from 'clsx';
import { useHistory } from 'react-router'
import { makeStyles, useTheme } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { Paper, Tabs, Tab, Typography, Box } from "@material-ui/core";
import SwipeableViews from 'react-swipeable-views';
import Material_Table from "components/Table/Material_Table";
import { apiTxn_get_success, apiTxn_get_fail, apiTxn_get_waiting } from "../api"
import { check_status } from '../tools'

const columns = [
  {
    field: "stock_id",
    title: "證券代號",
  },
  {
    field: "stock.stock_name",
    title: "證券名稱",
  },
  {
    field: "type",
    title: "交易類型",
  },
  {
    field: "shares_number",
    title: "交易股數",
  },
  {
    field: "bid_price",
    title: "每股出價",
  },
  {
    field: "stock.closing_price",
    title: "每股成交價格",
  },
  {
    field: "order_time",
    title: "下單時間",
  },
  {
    field: "txn_time",
    title: "交易處理時間",
  },
]

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
  const [value, setValue] = useState(0); //控制導覽列
  const [successData, set_successData] = useState([])
  const [waitingData, set_waitingData] = useState([])
  const [failData, set_failData] = useState([])
  const [ loading, setLoading ] = useState(false)
  const history = useHistory()

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getTabBarStyles = useCallback((current_i) => {
    if(current_i==0) return classes.customTabs_success
    else if(current_i==1) return classes.customTabs_wait
    else if(current_i==2) return classes.customTabs_error
  }, [value])

  const getTabStyles = useCallback((current_i, i) => {
    if(i==0 && current_i == i) return classes.tabRoot_success
    else if(i==1 && current_i == i) return classes.tabRoot_wait
    else if(i==2 && current_i == i) return classes.tabRoot_fail
  }, [value])

  const loadData = async() => {
    setLoading(true)

    const success_res = await check_status(apiTxn_get_success)
    const waiting_res = await check_status(apiTxn_get_waiting)
    const fail_res = await check_status(apiTxn_get_fail)

    if(success_res.res && waiting_res.res && fail_res.res) {
      
    } else {
      alert(success_res.msg)
      if(success_res.need_login || waiting_res.need_login || fail_res.need_login) {
        history.replace("/login")
      }
    }

    set_successData(success_res.data)
    set_waitingData(waiting_res.data)
    set_failData(fail_res.data)
    setLoading(false)
  }
  
  useEffect(() => {
    loadData()
  }, [])

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
            <Tab label="待處理交易" className={clsx(classes.customTab, getTabStyles(value, 1))} />
            <Tab label="失敗交易" className={clsx(classes.customTab, getTabStyles(value, 2))} />
          </Tabs>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChange}
            className="pl-3 pr-3 pb-3"
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <Material_Table
                title="顯示所有交易紀錄"
                showToolBar
                search
                columns={columns}
                data={successData}
                noContainer
                noDataDisplay="沒有任何交易紀錄"
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <Material_Table
                title="顯示所有待處理交易紀錄"
                showToolBar
                search
                columns={columns}
                data={waitingData}
                noContainer
                noDataDisplay="沒有任何待處理交易紀錄"
              />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <Material_Table
                title="顯示所有失敗交易紀錄"
                showToolBar
                search
                columns={columns}
                data={failData}
                noContainer
                noDataDisplay="沒有任何失敗交易紀錄"
              />
            </TabPanel>
          </SwipeableViews>
        </Paper>
      </GridItem>
    </GridContainer>
  )
}