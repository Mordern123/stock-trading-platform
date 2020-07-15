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
import { apiUserStock_track_get, apiUserStock_track } from '../api'
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { useSnackbar } from 'notistack';
import { handle_error } from '../tools'

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
    title: "近期收盤價",
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

export const StockTrack = function() {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [searchTrack, setSearchTrack] = useState("");
  const [track_loading, setTrack_loading] = useState(false);
  const [userTrack, setUserTrack] = useState([]);
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
      handle_error(error, history)
    }
  }

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

  //載入用戶追蹤股票
  useEffect(() => {
    const loadData = async() => {
      setTrack_loading(true)
      try {
        const userTrack_res = await apiUserStock_track_get()
        setUserTrack(userTrack_res.data)
        
      } catch (error) {
        handle_error(error, history)
      }
      setTrack_loading(false)
    }
    loadData()
  }, [])

  return (
    <Fragment>
      <GridContainer>
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
    </Fragment>
  )
}