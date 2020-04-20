import React from 'react';
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const styles = theme => ({
  text: {
    fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
  },
  dialogContent: {
    overflow: 'hidden'
  }
})

const useStyles = makeStyles(styles);

export default function BuyDialog(props) {
  const classes = useStyles();
  const { open, handleClose, stockInfo } = props
  const { stock_id, stock_name, trading_volume, txn_number, closing_price } = stockInfo

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      fullWidth={true}
      maxWidth='sm'
    >
      <DialogTitle
        children={
          <Typography variant="h5" className={classes.text}>購買資訊</Typography>
        }
      />
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
        <div className="d-flex justify-content-center align-items-center">
          <TextField
            autoFocus
            label="請輸入股票購買數量"
            type="number"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  children={<Typography variant="div" className={classes.text}>張</Typography>}
                />
              ),
            }}
            InputLabelProps={{
              style: {
                fontFamily: "'Noto Sans TC', Helvetica, Arial, sans-serif",
              }
            }}
            className="w-50"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" className={classes.text}>
          取消訂單
        </Button>
        <Button onClick={handleClose} color="primary" className={classes.text}>
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
