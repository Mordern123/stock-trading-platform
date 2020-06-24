import React, { useState } from 'react';
import PropTypes from "prop-types";
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router'
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
import { apiUserStock_sell } from '../../api'
import { green, red } from '@material-ui/core/colors';
import Snack_Detail from './Snack_Detail'
import { useSnackbar } from 'notistack';
import { check_status } from '../../tools';


const testUser = "5ea7c55655050f2b883173ce" 

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
  cancelButton: {
    color: theme.palette.getContrastText(red[700]),
    backgroundColor: red[700],
    '&:hover': {
      backgroundColor: red[900],
    },
  },
  submitButton: {
    color: theme.palette.getContrastText(green[700]),
    backgroundColor: green[700],
    '&:hover': {
      backgroundColor: green[900],
    },
  },
  button: {
    "&:focus": {
      outline: 'none',
    }
  }
})

const useStyles = makeStyles(styles);

export default function SellDialog(props) {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { open, handleClose, stockInfo } = props
  const { shares_number, stock } = stockInfo
  const { stock_id, stock_name, txn_number, closing_price } = stock
  const [ stock_price, setStock_price ] = useState(null)
  const [ stock_num, setStock_num ] = useState(null)
  const [ loading, setLoading ] = useState(false)
  const history = useHistory()

  const handlePriceChange = (e) => {
    let n = parseInt(e.target.value)
    setStock_price(n)
  }
  const handleNumberChange = (e) => {
    let n = parseInt(e.target.value)
    setStock_num(n)
  }

  const handleSellStock = async () => {
    if(stock_num && stock_price) {
      if(stock_num > 0 && stock_price > 0) {
        setLoading(true)
        try {
          const res = await apiUserStock_sell({
            uid: testUser,
            stock_id: stock.stock_id,
            shares_number: stock_num * 1000, //一張1000股
            price: stock_price
          })
          setTimeout(() => {
            setLoading(false)
            handleClose()
            if(res.data) {
              addSnack() //發出通知
            }
          }, 1000)
          
        } catch (error) {
          const { need_login, msg } = check_status(error.response.status)
          alert(msg)
          if(need_login) {
            history.replace("/login", { need_login })
          }
        }
      } else {
        alert('輸入值要大於0')
      }
    } else {
      alert('欄位不能為空')
    }
  }

  const addSnack = () => {
    enqueueSnackbar(`下單成功【${stock_id} ${stock_name}】`,{
      anchorOrigin: { horizontal: 'right', vertical: 'top' },
      content: (key, message) => (
        <Snack_Detail
          id={key}
          message={message} 
          data={{
            stock_id,
            stock_name,
            stock_num,
            stock_price
          }}
        />
      ),
      persist: true
    })
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      fullWidth={true}
      maxWidth='sm'
    >
      <DialogTitle className={classes.dialogTitle}>售出資訊</DialogTitle>
      <DialogContent className={clsx(classes.dialogContent, classes.text)}>
        <DialogContentText className={classes.text}>請確認售出股票內容</DialogContentText>
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
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`成交股數： ${txn_number} 股`}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem button className={classes.text}>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`收盤價： ${closing_price} NT/股`}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem button className={classes.text}>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`目前擁有股數： ${shares_number} 股 (${parseInt(shares_number/1000)}張)`}</Typography>} />
          </ListItem>
          <Divider />
          
        </List>
        <div className="row d-flex justify-content-end align-items-center mt-3">
          <div className="col-5">
            <TextField
              label="每股售出價格"
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
              label="股票售出數量"
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
          <CircularProgress color="primary" />
        </Backdrop>
      </DialogContent>
      <DialogActions className="p-3">
        <Button
          variant="contained"
          onClick={handleClose}
          classes={{root: classes.cancelButton}}
          className={clsx(classes.text, classes.button)}
        >
          取消訂單
        </Button>
        <Button
          variant="contained"
          onClick={handleSellStock}
          classes={{root: classes.submitButton}}
          className={clsx(classes.text, classes.button)}
        >
          確定下單
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SellDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  stockInfo: PropTypes.object
}
