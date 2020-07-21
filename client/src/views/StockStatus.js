import React, { useState, useEffect, useCallback } from "react";
import clsx from 'clsx';
import { useHistory } from 'react-router'
import { makeStyles, useTheme } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { Paper, Tabs, Tab, Typography, Box } from "@material-ui/core";
import SwipeableViews from 'react-swipeable-views';
import Material_Table from "components/Table/Material_Table";
import { apiTxn_get_all } from "../api"
import { handle_error, transfer_fail_msg } from '../tools'

const get_columns = (type) => {
  if(type === 'fail') {
    return  [
      {
        field: "stock_id",
        title: "證券代號",
      },
      {
        field: "stockInfo.stock_name",
        title: "證券名稱",
      },
      {
        field: "type",
        title: "交易類型",
      },
      {
        field: "stockInfo.z",
        title: "交易價格",
      },
      {
        field: "shares_number",
        title: "交易股數",
      },
      {
        field: "msg",
        title: "失敗原因"
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
    
  } else {
    return  [
      {
        field: "stock_id",
        title: "證券代號",
      },
      {
        field: "stockInfo.stock_name",
        title: "證券名稱",
      },
      {
        field: "type",
        title: "交易類型",
      },
      {
        field: "stockInfo.z",
        title: "交易價格",
      },
      {
        field: "shares_number",
        title: "交易股數",
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
  }
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
    },
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

export const StockStatus = function() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0); //控制導覽列
  const [successData, set_successData] = useState([])
  const [waitingData, set_waitingData] = useState([])
  const [failData, set_failData] = useState([])
  const [ loading, setLoading ] = useState(false)
  const history = useHistory()

  const handleChange = (event, newValue) => {
    localStorage.setItem("status_tab", newValue)
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

  
  //載入交易
  React.useEffect(() => {
    const loadData = async() => {
      try {
        setLoading(true)
        let res = await apiTxn_get_all()
        let success = res.data.filter((item) => { return item.status === "success"})
        let waiting = res.data.filter((item) => { return item.status === "waiting"})
        let _fail = res.data.filter((item) => { return item.status === "fail"})
        let fail = _fail.map((item) => { return { ...item, msg: transfer_fail_msg(item.msg)} }) //轉換錯誤訊息

        set_successData(success)
        set_waitingData(waiting)
        set_failData(fail) 
        setLoading(false)

      } catch (error) {
        handle_error(error, history)
      }
    }
    loadData()
  }, [])

  //初始設定Tab
  React.useEffect(() => {
    let tab = localStorage.getItem("status_tab")
    if(tab) {
      setValue(parseInt(tab))
    } else {
      localStorage.setItem("status_tab", 0)
      setValue(0)
    }
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
            <Tab label="成功交易" className={clsx("col h-100", classes.customTab, getTabStyles(value, 0))} />
            <Tab label="待處理交易" className={clsx("col h-100", classes.customTab, getTabStyles(value, 1))} />
            <Tab label="失敗交易" className={clsx("col h-100", classes.customTab, getTabStyles(value, 2))} />
          </Tabs>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChange}
            className="pl-3 pr-3 pb-3"
            disabled={true}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <Material_Table
                title=""
                showToolBar
                search
                columns={get_columns("success")}
                data={successData}
                noContainer
                noDataDisplay="沒有任何交易紀錄"
                isLoading={loading}
                headerStyle={{backgroundColor: '#e8f5e9'}}
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <Material_Table
                title=""
                showToolBar
                search
                columns={get_columns("waiting")}
                data={waitingData}
                noContainer
                noDataDisplay="沒有任何待處理交易紀錄"
                isLoading={loading}
                headerStyle={{backgroundColor: '#e1f5fe'}}
              />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <Material_Table
                title=""
                showToolBar
                search
                columns={get_columns("fail")}
                data={failData}
                noContainer
                noDataDisplay="沒有任何失敗交易紀錄"
                isLoading={loading}
                headerStyle={{backgroundColor: '#ffebee'}}
              />
            </TabPanel>
          </SwipeableViews>
        </Paper>
      </GridItem>
    </GridContainer>
  )
}