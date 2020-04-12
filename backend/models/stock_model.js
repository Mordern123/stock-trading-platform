import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const stockSchema = new Schema({
  data_time: {
    type: Schema.Types.Date,
    required: true,
    trim: true,
  },
  stock_id: { //證券代號
    type: String,
    required: true,
    trim: true,
  },
  stock_name: { //證券名稱
    type: String,
    required: true,
    trim: true,
  },
  trading_volume: { //成交股數
    type: String,
    required: true,
    trim: true,
  },
  txn_number: { //成交筆數
    type: String,
    required: true,
    trim: true,
  },
  turnover_value: { //成交金額
    type: String,
    required: true,
    trim: true,
  },
  opening_price: { //開盤價
    type: String,
    required: true,
    trim: true,
  },
  highest_price: { //最高價
    type: String,
    required: true,
    trim: true,
  },
  lowest_price: { //最低價
    type: String,
    required: true,
    trim: true,
  },
  closing_price: { //收盤價
    type: String,
    required: true,
    trim: true,
  },
  up_down: { //漲跌(+/-)
    type: String,
  },
  up_down_spread: { // 漲跌價差
    type: String,
    trim: true,
  },
  last_buy_price: { // 最後揭示買價
    type: String,
    trim: true,
  },
  last_buy_volume: { // 最後揭示買量
    type: String,
    trim: true,
  },
  last_sell_price: { // 最後揭示賣價
    type: String,
    trim: true,
  },
  last_sell_volume: { // 最後揭示賣量
    type: String,
    trim: true,
  },
  PE_ratio: { //本益比
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Stock = mongoose.model('Stock', stockSchema, 'stock');

export default Stock;