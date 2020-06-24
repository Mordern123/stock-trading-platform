import React, { useState, useEffect, useRef, Fragment, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router'
import { InputBase, IconButton, Divider, Paper, Button } from '@material-ui/core';
import { Search, ShowChart, AccountBalanceRounded, LocalAtmRounded } from '@material-ui/icons';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Material_Table from 'components/Table/Material_Table';
import BuyDialog from 'components/Transaction/Dialog_Buy';
import CardStat from 'components/Transaction/Card_Stat';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import { apiStock_list_all, apiUserStock_track, apiUserStock_track_get, apiUserStock_get, apiUser_account } from '../api'
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { check_status } from '../tools'

//bubble sort
const customSort = (a, b, field) => {
  let pureS1 = a[field].replace(/,/g, "")
  let pureS2 = b[field].replace(/,/g, "")
  let n1 = isNaN(parseFloat(pureS1)) ? 0 : parseFloat(pureS1)
  let n2 = isNaN(parseFloat(pureS2)) ? 0 : parseFloat(pureS2)
  return n1 - n2
}

const stock_columns = [
  {
    field: "stock_id",
    title: "證券代號",
  },
  {
    field: "stock_name",
    title: "證券名稱",
  },
  {
    field: "trading_volume",
    title: "成交股數",
    customSort: (a, b) => customSort(a, b, "trading_volume")
  },
  {
    field: "txn_number",
    title: "成交筆數",
    customSort: (a, b) => customSort(a, b, "txn_number")
  },
  {
    field: "turnover_value",
    title: "成交金額",
    customSort: (a, b) => customSort(a, b, "turnover_value")
  },
  {
    field: "opening_price",
    title: "開盤價",
    customSort: (a, b) => customSort(a, b, "opening_price")
  },
  {
    field: "highest_price",
    title: "最高價",
    customSort: (a, b) => customSort(a, b, "highest_price")
  },
  {
    field: "lowest_price",
    title: "最低價",
    customSort: (a, b) => customSort(a, b, "lowest_price")
  },
  {
    field: "closing_price",
    title: "收盤價",
    customSort: (a, b) => customSort(a, b, "closing_price")
  },
  {
    field: "up_down",
    title: "漲跌(+/-)",
  },
  {
    field: "up_down_spread",
    title: "漲跌價差",
    customSort: (a, b) => customSort(a, b, "up_down_spread")
  },
  {
    field: "last_buy_price",
    title: "最後揭示買價",
    customSort: (a, b) => customSort(a, b, "last_buy_price")
  },
  {
    field: "last_buy_volume",
    title: "最後揭示買量",
    customSort: (a, b) => customSort(a, b, "last_buy_volume")
  },
  {
    field: "last_sell_price",
    title: "最後揭示賣價",
    customSort: (a, b) => customSort(a, b, "last_sell_price")
  },
  {
    field: "last_sell_volume",
    title: "最後揭示賣量",
    customSort: (a, b) => customSort(a, b, "last_sell_volume")
  },
  {
    field: "PE_ratio",
    title: "本益比",
    customSort: (a, b) => customSort(a, b, "PE_ratio")
  },
];

const styles = theme => ({
  text: {
    fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
  },
  searchBox: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  searchInput: {
    "& input" : {
      textAlign: 'center',
      fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
    },
    marginLeft: theme.spacing(1),
    flex: 1,
    height: '80px',
    fontSize: 'xx-large'
  },
  divider: {
    height: '50px',
    margin: 4,
  },
})

const useStyles = makeStyles(styles);

export default function Transaction(props) {
  const searchRef = useRef();
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [ searchText, setSearchText ] = useState("");
  const [ stock_data, setStock_data ] = useState([]);
  const [ track_data, setTrack_data ] = useState([]);
  const [ userStock_data, setUserStock_data ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ showBuyDialog, set_showBuyDialog] = useState(false);
  const [ stockInfo, setStockInfo] = useState(null);
  const [ account, setAccount ] = useState(null);
  const history = useHistory()

  const handleCloseStockBuy = () => {
    set_showBuyDialog(false)
  }

  const handleSearch = () => {
    setLoading(true)
    setSearchText(searchRef.current.childNodes[0].value) //拿InputBase裡面的Input
    setTimeout(() => { setLoading(false) }, 2000); 
  }

  const handleOpenStockBuy = (event, row) => {
    const matchStock = userStock_data.find(stock => stock.stock_id == row.stock_id) || {}
    setStockInfo({
      stock: row,
      userStock: matchStock
    })
    set_showBuyDialog(true)
  }

  const handleTrack = async(event, row) => {
    setLoading(true)
    try {
      const status = track_data.includes(row.stock_id) //追蹤狀態
      const res = await apiUserStock_track({
        stock_id: row.stock_id
      })
      if(res.data) {
        const track_res = await apiUserStock_track_get()
        let onlyTrackId_data = track_res.data.map(item => item.stock_id)
        setTrack_data(onlyTrackId_data)
      }
      setTimeout(() => {
        setLoading(false)
        if(status) {
          addSnack(`已取消 ${row.stock_id}【${row.stock_name}】的追蹤`, "success")
        } else {
          addSnack(`已將 ${row.stock_id}【${row.stock_name}】加入追蹤`, "success")
        }
      }, 1000);

    } catch(error) {
      const { need_login, msg } = check_status(error.response.status)
      alert(msg)
      if(need_login) {
        history.replace("/login", { need_login })
      }
    }
  }

  //取得股票相關資料
  const loadData = async() => {
    setLoading(true)

    try {
      const account_res = await apiUser_account()
      const stock_res = await apiStock_list_all()
      const userStock_res = await apiUserStock_get() 
      const track_res = await apiUserStock_track_get()
      const onlyTrackId_data = track_res.data.map(item => item.stock_id) //只要stock_id
      setAccount(account_res.data)
      setUserStock_data(userStock_res.data)
      setTrack_data(onlyTrackId_data)
      setStock_data(stock_res.data)
      
    } catch (error) {
      const { need_login, msg } = check_status(error.response.status)
      alert(msg)
      if(need_login) {
        history.replace("/login", { need_login })
      }
    }

    setLoading(false)
  }

  const getActions = useCallback(() => ([
    {
      icon: 'refresh',
      tooltip: 'Refresh Data',
      isFreeAction: true,
      onClick: () => {},
    },
    {
      icon: () => <ShoppingCartOutlinedIcon />,
      tooltip: 'Buy Stock',
      onClick: handleOpenStockBuy
    },
    rowData => {
      let inCollect = track_data.includes(rowData.stock_id) //判斷此股票使用者有沒有收藏
      return {
        icon: () => inCollect
          ? <FavoriteRoundedIcon />
          : <FavoriteBorderRoundedIcon />
        ,
        tooltip: inCollect ? 'Remove from Collect' : 'Add to Collect',
        onClick: handleTrack
      }
    }
  ]), [track_data])

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

  const addTimeSnack = (msg, color) => {
    enqueueSnackbar(msg, {
      variant : color,
      anchorOrigin: { horizontal: 'center', vertical: 'top' },
    })
  }

  useEffect(() => {
    loadData()
    addTimeSnack(`股票更新時間：${moment().calendar()}`, 'info')
  }, [])
  
  return (
    <Fragment>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6}>
          <CardStat
            title="目前總資產"
            updateTime={account ? `${account.last_update} 更新` : '更新中...'}
            value={account ? account.balance : 0}
            color="success"
            icon={<AccountBalanceRounded />}
          />
        </GridItem>
        <GridItem xs={12} sm={6} md={6}>
          <CardStat
            title="股票總價值"
            updateTime={account ? `${account.last_update} 更新` : '更新中...'}
            value={account ? account.stock_value : 0}
            color="warning"
            icon={<LocalAtmRounded />}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Paper component="form" elevation={5} className={`${classes.searchBox} mb-3`}>
            <IconButton color="primary" className="p-3" >
              <ShowChart fontSize="large"/>
            </IconButton>
            <InputBase
              ref={searchRef}
              className={classes.searchInput}
              placeholder="搜尋任何股票關鍵字"
            />
            <IconButton
              type="button"
              color="primary"
              className="p-3"
              onClick={handleSearch}
            >
              <Search fontSize="large"/>
            </IconButton>
          </Paper>
          <Material_Table
            title="今日所有股票"
            columns={stock_columns}
            data={stock_data}
            searchText={searchText}
            isLoading={loading}
            showToolBar={true}
            useSearch={false}
            useExport={true}
            actions={getActions()}
            maxBodyHeight={700}
            handleOpenStockBuy={handleOpenStockBuy}
            noDataDisplay="沒有符合的股票"
          />
        </GridItem>
      </GridContainer>
      {
        stockInfo ? (
          <BuyDialog
            open={showBuyDialog}
            handleClose={handleCloseStockBuy}
            stockInfo={stockInfo}
          />
        ) : null
      }
    </Fragment>
  )
}