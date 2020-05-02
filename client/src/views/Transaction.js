import React, { useState, useEffect, useRef, Fragment, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { InputBase, IconButton, Divider, Paper } from '@material-ui/core';
import { Search, ShowChart, AccountBalanceRounded, LocalAtmRounded } from '@material-ui/icons';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Material_Table from 'components/Table/Material_Table';
import BuyDialog from 'components/Transaction/Dialog_Buy';
import CardStat from 'components/Transaction/Card_Stat';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import { apiStock_list_all, apiUserStock_track, apiUserStock_track_get, apiUserStock_get } from '../api'

const testUser = "5ea7c55655050f2b883173ce"

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
    title: "最後揭示賣價",
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

export default function Transaction() {
  const searchRef = useRef();
  const classes = useStyles();
  const [ searchText, setSearchText ] = useState("");
  const [ stock_data, setStock_data ] = useState([]);
  const [ track_data, setTrack_data ] = useState([]);
  const [ userStock_data, setUserStock_data ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ showBuyDialog, set_showBuyDialog] = useState(false);
  const [ stockInfo, setStockInfo] = useState(null);
  const [ account, setAccount ] = useState(null);

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
    const res = await apiUserStock_track({
      uid: testUser,
      stock_id: row.stock_id
    })
    if(res.data) {
      const track_res = await apiUserStock_track_get({
        uid: testUser
      })
      let onlyTrackId_data = track_res.data.map(item => item.stock_id)
      setTrack_data(onlyTrackId_data)
    }
    setTimeout(() => { setLoading(false) }, 1000);
  }

  //取得股票相關資料
  const loadData = async() => {
    setLoading(true) 
    const stock_res = await apiStock_list_all()
    const userStock_res = await apiUserStock_get({
      uid: testUser
    }) 
    const track_res = await apiUserStock_track_get({
      uid: testUser
    })
    let onlyTrackId_data = track_res.data.map(item => item.stock_id)
    setUserStock_data(userStock_res.data)
    setTrack_data(onlyTrackId_data)
    setStock_data(stock_res.data)
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


  useEffect(() => {
    loadData()
  }, [])
  
  return (
    <Fragment>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6}>
          <CardStat
            title="目前總資產"
            updateTime="1分鐘前更新"
            value={34245}
            color="success"
            icon={<AccountBalanceRounded />}
          />
        </GridItem>
        <GridItem xs={12} sm={6} md={6}>
          <CardStat
            title="股票總價值"
            updateTime="1天前收盤價更新"
            value={0}
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
            maxBodyHeight={1000}
            handleOpenStockBuy={handleOpenStockBuy}
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