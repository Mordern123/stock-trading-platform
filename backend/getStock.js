import fs from 'fs'
import axios from 'axios'
import Stock from './models/stock_model'
import mongoose from 'mongoose'
require('dotenv').config()


const init = () => {
  const connection = mongoose.connection;
  connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
    console.log("The database is " + connection.name)
    // getStock(new Date(Date.now()))
    getStock(new Date('2020-04-10'))
  })
  mongoose.connect(process.env.DB_CONN_STRING, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
}

const getStock = async(time) => {
  const res = await axios.get(`http://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=${convertDate(time)}&type=ALL`, { headers: { Connection: 'close'}})
  // 沒有資料就停止程序
  if(res.data['data9'] == null) {
    process.exit() 
  }
  const stockData = {
    cloumns: res.data['fields9'],
    data: res.data['data9']
  }
  // 將資料加進自定義array
  const stock_array = [];
  stockData['data'].forEach(stock_item => {
    stock_array.push({
      data_time: time,
      stock_id: stock_item[0],
      stock_name: stock_item[1],
      trading_volume: stock_item[2],
      txn_number: stock_item[3],
      turnover_value: stock_item[4],
      opening_price: stock_item[5],
      highest_price: stock_item[6],
      lowest_price: stock_item[7],
      closing_price: stock_item[8],
      up_down: getUpDown(stock_item[9]),
      up_down_spread: stock_item[10],
      last_buy_price: stock_item[11],
      last_buy_volume: stock_item[12],
      last_sell_price: stock_item[13],
      last_sell_volume: stock_item[14],
      PE_ratio: stock_item[15],
    })
  })
  // 資料匯入mongoDB
  if(stock_array.length > 0) {
    Stock.collection.insertMany(stock_array, () => {
      console.log("新增完成")
      process.exit()
    })
    
  }
}

const write_json = (stockData) => {
  const json = JSON.stringify(stockData)
  fs.writeFile("stock.json", json, 'utf8', (error) => {
    if(!error) {
      console.log("檔案已匯出")
    }
  })
}

const convertDate = (time) => {
  const year = time.getFullYear()
  const month = ("0" + (time.getMonth() + 1)).slice(-2)
  const date = ("0" + time.getDate()).slice(-2)
  return `${year}${month}${date}`;
}

const getUpDown = (str) => {
  if(str.includes('+')) {
    return '+'
  } else if(str.includes('-')) {
    return '-'
  } else {
    return ""
  }
}

init();

