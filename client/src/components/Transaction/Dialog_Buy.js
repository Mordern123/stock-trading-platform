import React, { useState } from 'react';
import PropTypes from "prop-types";
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { apiUserStock_buy } from '../../api'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const styles = theme => ({
  text: {
    fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
  },
  dialogContent: {
    overflow: 'hidden'
  },
  stockInput: {
    "& label": {
      fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
    }
  },
  dialogTitle: {
    "& h2": {
      fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
    }
  },
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.info.dark,
    backgroundColor: 'rgba(66, 66, 66, 0.2)'
  },
})

const useStyles = makeStyles(styles);

export default function BuyDialog(props) {
  const classes = useStyles();
  const { open, handleClose, stockInfo } = props
  const { stock_id, stock_name, trading_volume, txn_number, closing_price } = stockInfo
  const [stock_price, setStock_price] = useState(null)
  const [stock_num, setStock_num] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePriceChange = (e) => {
    let n = parseInt(e.target.value)
    setStock_price(n)
  }
  const handleNumberChange = (e) => {
    let n = parseInt(e.target.value)
    setStock_num(n)
  }

  const handleBuyStock = async () => {
    if(stock_num && stock_price) {
      if(stock_num > 0 && stock_price > 0) {
        setLoading(true)
        const res = await apiUserStock_buy({
          uid: "5ea7c55655050f2b883173ce",
          stock_id: stockInfo.stock_id,
          shares_number: stock_num * 1000,
          price: stock_price
        })
        
        setLoading(false)
        handleClose()
        console.log(res.data)
      } else {
        alert('輸入值要大於0')
      }
    } else {
      alert('欄位不能為空')
    }
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      fullWidth={true}
      maxWidth='sm'
    >
      <DialogTitle className={classes.dialogTitle}>購買資訊</DialogTitle>
      <DialogContent className={clsx(classes.dialogContent, classes.text)}>
        <DialogContentText className={classes.text}>請確認購買股票的內容</DialogContentText>
        <List component="nav">
          <ListItem button>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`證券代號： ${stock_id}`}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem button className={classes.text}>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`證券名稱： ${stock_name}`}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem button className={classes.text}>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`總成交股數： ${trading_volume}`}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem button className={classes.text}>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`總成交筆數： ${txn_number}`}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem button className={classes.text}>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`收盤價： ${closing_price}`}</Typography>} />
          </ListItem>
        </List>
        <div className="row d-flex justify-content-end align-items-center mt-3">
          <div className="col-5">
            <TextField
              label="股票購買價格"
              type="number"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    children={<Typography>NT$</Typography>}
                  />
                ),
              }}
              inputProps={{
                min: 0
              }}
              className={clsx("w-100 mr-3",classes.stockInput)}
              onChange={handlePriceChange}
            />
          </div>
          <div className="col-4">
            <TextField
              label="股票購買數量"
              type="number"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    children={<Typography className={classes.text}>張</Typography>}
                  />
                ),
              }}
              inputProps={{
                min: 0
              }}
              className={clsx("w-15",classes.stockInput)}
              onChange={handleNumberChange}
            />
          </div>
          
        </div>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="blue" />
        </Backdrop>
      </DialogContent>
      <DialogActions className="p-3">
        <Button variant="contained" onClick={handleClose} color="primary" className={clsx(classes.text)}>
          取消訂單
        </Button>
        <Button variant="contained" onClick={handleBuyStock} color="primary" className={classes.text}>
          確定下單
        </Button>
      </DialogActions>
    </Dialog>
  );
}

BuyDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  stockInfo: PropTypes.object
}
