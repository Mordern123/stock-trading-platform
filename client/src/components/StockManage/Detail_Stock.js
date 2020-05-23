import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import EqualizerRoundedIcon from '@material-ui/icons/EqualizerRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import ShowChartRoundedIcon from '@material-ui/icons/ShowChartRounded';
import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles({
  
});

function Detail_Stock(props) {
  const classes = useStyles();
  const { stockData } = props
  const {
    stock_id,
    stock_name,
    trading_volume,
    txn_number,
    turnover_value,
    opening_price,
    highest_price,
    lowest_price,
    closing_price,
    up_down,
    up_down_spread,
    last_buy_price,
    last_buy_volume,
    last_sell_price,
    last_sell_volume,
    PE_ratio
  } = stockData
  
  return (
    <Paper className="row">
      <div className="col-6">
        <List dense={true}>
          <ListItem>
            <ListItemIcon>
              <StarRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`證券代號：${stock_id}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <StarRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`證券名稱：${stock_name}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EqualizerRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`成交股數：${trading_volume}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EqualizerRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`成交筆數：${txn_number}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MonetizationOnRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`成交金額：${turnover_value}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MonetizationOnRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`開盤價：${opening_price}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MonetizationOnRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`最高價：${highest_price}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MonetizationOnRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`最低價：${lowest_price}`}
            />
          </ListItem>
        </List>
      </div>
      <div className="col-6">
        <List dense={true}>
          <ListItem>
            <ListItemIcon>
              <MonetizationOnRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`收盤價：${closing_price}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ShowChartRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`漲跌(+/-)：${up_down}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MonetizationOnRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`漲跌價差：${up_down_spread}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MonetizationOnRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`最後揭示買價：${last_buy_price}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EqualizerRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`最後揭示買量：${last_buy_volume}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MonetizationOnRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`最後揭示賣價：${last_sell_price}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EqualizerRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`最後揭示賣量：${last_sell_volume}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ShowChartRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary={`本益比：${PE_ratio}`}
            />
          </ListItem>
        </List>
      </div>
    </Paper>
  )
}

Detail_Stock.propTypes = {

}

export default Detail_Stock

