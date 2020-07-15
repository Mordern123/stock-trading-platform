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
import { handle_error } from '../../tools';
import delay from 'delay'

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
  const { open, handleClose, stockData } = props
  const { stockInfo, userStock } = stockData
  const { stock_id, stock_name } = stockInfo
  const [ stock_num, set_stock_num ] = useState(null)
  const [ loading, setLoading ] = useState(false)
  const [reserve_time, set_reserve_time] = useState(180) //價格保留時間
  const history = useHistory()

  const onChange = (e) => {
    let n = parseInt(e.target.value)
    set_stock_num(n)
  }

  const handleSellStock = async () => {
    if(loading) return
    if(stock_num) {
      if(stock_num > 0) {
        setLoading(true)
        try {
          const res = await apiUserStock_sell({
            stock_id: stockInfo.stock_id,
            shares_number: stock_num * 1000, //一張1000股
            stockInfo: stockInfo
          })
          await delay(1000)

          if(res.status === 200) {
            addSnack() //發出通知
          } else {
            alert("交易失敗，請稍後嘗試")
          }
          setLoading(false)
          handleClose()
          
        } catch (error) {
          handle_error(error, history)
          handleClose()
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
            stock_price: stockInfo.z
          }}
        />
      ),
      persist: true
    })
  }

  //設定關閉機制
  React.useEffect(() => {
    let interval = setInterval(() => {
      if(reserve_time > 0) {
        set_reserve_time(reserve_time-1)
      } else {
        handleClose()
      }
    }, 1000);

    return () => clearInterval(interval)
  }, [reserve_time])

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      fullWidth={true}
      maxWidth='sm'
    >
      <DialogTitle className={classes.dialogTitle}>
        <div className="d-flex align-items-center justify-content-between">
          <span className="mr-1" style={{fontSize: '30px', fontWeight: 'bold'}}>{stockInfo.stock_name}</span>
          <div style={{color: '#e57373', fontSize: '1rem'}}>
            {`價格保留時間: ${reserve_time} 秒`}
          </div>
        </div>
      </DialogTitle>
      <DialogContent className={clsx(classes.dialogContent, classes.text)}>
        <DialogContentText className={classes.text}>股票即時資料有可能因網路速度有1~2分鐘的誤差值</DialogContentText>
        <List component="nav">
          <ListItem button>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`證券代號： ${stockInfo.stock_id}`}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem button className={classes.text}>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`即時成交價： ${stockInfo.z}`}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem button className={classes.text}>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`漲跌： ${stockInfo.ud}`}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem button className={classes.text}>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`累積成交量： ${stockInfo.v}`}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem button className={classes.text}>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`開盤： ${stockInfo.o}`}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem button className={classes.text}>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`每日最高： ${stockInfo.h}`}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem button className={classes.text}>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`每日最低： ${stockInfo.l}`}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem button className={classes.text}>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`昨收： ${stockInfo.y}`}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem button className={classes.text}>
            <ListItemText primary={<Typography variant="subtitle1" className={classes.text}>{`近期買入價： ${userStock.stockInfo.z}`}</Typography>} />
          </ListItem>
          <Divider />
          <ListItem button className={classes.text}>
            <ListItemText
              primary={
                <Typography variant="subtitle1" className={classes.text}>
                  {`目前擁有股數： ${userStock ? userStock.shares_number : 0} 股 (${userStock ? parseInt(userStock.shares_number/1000) : 0}張)`}
                </Typography>
              } 
            />
          </ListItem>
          <Divider />
        </List>
        <div className="row d-flex justify-content-end align-items-center mt-3">
          <div className="col-5">
            <TextField
              label="股票賣出數量"
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
              className={clsx("w-100",classes.stockInput)}
              onChange={onChange}
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
