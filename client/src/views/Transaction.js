import React, { useState, useEffect, useRef, Fragment } from "react";
import clsx from 'clsx';
import { makeStyles } from "@material-ui/core/styles";
import { InputBase, IconButton, Divider, Paper } from '@material-ui/core';
import { Search, ShowChart, Store, DateRange } from '@material-ui/icons';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Material_Table from 'components/Table/Material_Table';
import Typography from '@material-ui/core/Typography';
import BuyDialog from 'components/Transaction/Dialog_Buy';
import { apiStock_list_all } from '../api'

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
  cardSubTitle: {
    color: theme.palette.text.secondary,
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0"
  },
  cardTitle: {
    color: theme.palette.text.primary,
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    marginBottom: "3px",
    textDecoration: "none",
  }
})

const loadStockData = async(setData, loading) => {
  loading(true)
  const res = await apiStock_list_all()
  setData(res.data)
  loading(false)
}

const useStyles = makeStyles(styles);
const useDash = makeStyles(dashboardStyle);

export default function Transaction() {
  const searchRef = useRef();
  const tableRef = useRef();
  const classes = useStyles();
  const d_classes = useDash();
  const [ searchText, setSearchText ] = useState("");
  const [ stock_data, setStock_data ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ pageSize, setPageSize] = useState(50);
  const [ showBuyDialog, set_showBuyDialog] = useState(false);
  const [ stockInfo, setStockInfo] = useState(null);

  const handleOpenStockBuy = (event, row) => {
    console.log(row)
    setStockInfo(row)
    set_showBuyDialog(true)
  }

  const handleCloseStockBuy = () => {
    set_showBuyDialog(false)
  }

  const handleSearch = () => {
    setLoading(true)
    // 拿InputBase裡面的Input
    setSearchText(searchRef.current.childNodes[0].value)
    setTimeout(() => {
      setLoading(false)
      // 讓提示字串置中
      if(tableRef.current.state.data.length == 0) {
        setPageSize(5)
      } else {
        setPageSize(50)
      }
    }, 2000);
  }

  useEffect(() => {
    loadStockData(setStock_data, setLoading)
  }, [])
  
  return (
    <Fragment>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <Typography variant="p" className={clsx(classes.text,classes.cardSubTitle)}>目前總資產</Typography>
              <Typography variant="h4" className={clsx(classes.text,classes.cardTitle)}>$34,245</Typography>
              {/* <p className={d_classes.cardCategory}>目前總資產</p> */}
              {/* <h3 className={d_classes.cardTitle}>$34,245</h3> */}
            </CardHeader>
            <CardFooter stats>
              <div className={d_classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={d_classes.cardCategory}>目前股票資產</p>
              <h3 className={d_classes.cardTitle}>$34,245</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={d_classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
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
            tableRef={tableRef}
            title="今日所有股票"
            columns={stock_columns}
            data={stock_data}
            searchText={searchText}
            isLoading={loading}
            showToolBar={true}
            useSearch={false}
            useExport={true}
            maxBodyHeight={1000}
            pageSize={pageSize}
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