import React, { useState, useCallback, useEffect, Fragment } from "react";
import clsx from 'clsx';
import { useHistory } from 'react-router'
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Typography from '@material-ui/core/Typography';
import { TextField, InputAdornment, Button } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Material_Table from 'components/Table/Material_Table';
import { apiUserStock_get, apiUserStock_track_get, apiUserStock_track } from '../api'
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';
import SellDialog from 'components/StockManage/Dialog_Sell'
import StockDetail from 'components/StockManage/Detail_Stock'
import { useSnackbar } from 'notistack';
import { check_status } from '../tools'

const userStock_columns = [
  {
    field: "stock_id",
    title: "證券代號",
  },
  {
    field: "stock.stock_name",
    title: "證券名稱",
  },
  {
    field: "shares_number",
    title: "擁有股數"
  },
  {
    field: "last_update",
    title: "交易更新時間",
  },
  {
    field: "createdAt",
    title: "擁有時間"
  }
]

const userTrack_columns = [
  {
    field: "stock_id",
    title: "證券代號",
  },
  {
    field: "stock.stock_name",
    title: "證券名稱",
  },
  {
    field: "stock.closing_price",
    title: "目前每股價格",
  },
  {
    field: "track_time",
    title: "追蹤時間",
  },
]

const useStyles = makeStyles((theme) => ({
  '@global': {
    '.ch_font': {
      fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
    },
  },
  searchInput1: {
    margin: 8,
    width: '50%',
    "& input, label": {
      fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.warning.main,
    },
    "& label.MuiInputLabel-animated.Mui-focused ": {
      color: theme.palette.warning.main
    },
    "& .MuiOutlinedInput-root.Mui-focused svg": {
      color: theme.palette.warning.main,
    },
  },
  searchInput2: {
    margin: 8,
    width: '50%',
    "& input, label": {
      fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9830B0",
    },
    "& label.MuiInputLabel-animated.Mui-focused ": {
      color: "#9830B0"
    },
    "& .MuiOutlinedInput-root.Mui-focused svg": {
      color: "#9830B0"
    },
  },
}));

export default function StockManage() {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [searchStock, setSearchStock] = useState("");
  const [searchTrack, setSearchTrack] = useState("");
  const [stock_loading, setStock_loading] = useState(false);
  const [track_loading, setTrack_loading] = useState(false);
  const [userStock, setUserStock] = useState([]);
  const [userTrack, setUserTrack] = useState([]);
  const [stockInfo, setStockInfo] = useState(null);
  const [showSellDialog, set_showSellDialog] = useState(false)
  const history = useHistory()

  const handleTrack = async(event, row) => {
    setTrack_loading(true)

    try {
      const res = await apiUserStock_track({
        stock_id: row.stock_id
      })
      const userTrack_res = await apiUserStock_track_get()
      setUserTrack(userTrack_res.data)
      setTimeout(() => {
        setTrack_loading(false)
        addSnack(`已取消追蹤【${row.stock_id} ${row.stock.stock_name}】`, 'success')
      }, 1000);
      
    } catch (error) {
      const { need_login, msg } = check_status(error.response.status)
      alert(msg)
      if(need_login) {
        history.replace("/login", { need_login })
      }
    }
  }

  const handleCloseStockSold = () => {
    set_showSellDialog(false)
  }

  const handleOpenStockSell = (event, row) => {
    setStockInfo(row)
    set_showSellDialog(true)
  }

  const loadData = async() => {
    setStock_loading(true)
    setTrack_loading(true)
    try {
      const userStock_res = await apiUserStock_get()
      const userTrack_res = await apiUserStock_track_get()
      setUserStock(userStock_res.data)
      setUserTrack(userTrack_res.data)
      
    } catch (error) {
      const { need_login, msg } = check_status(error.response.status)
      alert(msg)
      if(need_login) {
        history.replace("/login", { need_login })
      }
    }
    setStock_loading(false)
    setTrack_loading(false)
  }

  const getPanel = useCallback(() => [
    {
      tooltip: '顯示詳細資訊',
      render: rowData => {
        return <StockDetail stockData={rowData.stock}/>
      },
    },
  ])

  const addSnack = (msg, color) => {
    enqueueSnackbar(msg, {
      variant : color,
      anchorOrigin: { horizontal: 'right', vertical: 'top' },
      action: (key) => (
        <Button
          style={{ color: 'white' }}
          onClick={() => closeSnackbar(key) }
        >
          OK
        </Button>
      ),
      persist: true
    })
  }

  //初始執行一次
  useEffect(() => {
    loadData()
  }, [])

  return (
    <Fragment>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="warning">
              <Typography variant="subtitle1" className="ch_font">擁有的股票</Typography>
            </CardHeader>
            <CardBody>
              <TextField
                label="搜尋擁有股票"
                placeholder="輸入任何關鍵字"
                className={classes.searchInput1}
                margin="dense"
                variant="outlined"
                onChange={e => setSearchStock(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Material_Table
                searchText={searchStock}
                showToolBar={false}
                isLoading={stock_loading}
                columns={userStock_columns}
                data={userStock}
                noContainer={true}
                maxBodyHeight={'100%'}
                noDataDisplay="沒有擁有的股票"
                detailPanel={getPanel()}
                actions={[
                  {
                    icon: () => <MonetizationOnRoundedIcon />,
                    tooltip: '售出股票',
                    onClick: handleOpenStockSell
                  },
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <Typography variant="subtitle1" className="ch_font">追蹤的股票</Typography>
            </CardHeader>
            <CardBody>
              <TextField
                label="搜尋追蹤股票"
                placeholder="輸入任何關鍵字"
                margin="dense"
                className={classes.searchInput2}
                variant="outlined"
                onChange={e => setSearchTrack(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Material_Table
                searchText={searchTrack}
                showToolBar={false}
                isLoading={track_loading}
                columns={userTrack_columns}
                data={userTrack}
                noContainer={true}
                maxBodyHeight={'100%'}
                noDataDisplay="沒有追蹤的股票"
                actions={[
                  {
                    icon: () => <ClearRoundedIcon />,
                    tooltip: '取消追蹤',
                    onClick: handleTrack
                  },
                ]}
                actionsColumnIndex={-1}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      {
        stockInfo ? (
          <SellDialog
            open={showSellDialog}
            handleClose={handleCloseStockSold}
            stockInfo={stockInfo}
          />
        ) : null
      }
    </Fragment>
  )
}