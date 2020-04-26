import mongoose from 'mongoose'
import UserStock from './models/user_stock_model'
import UserTxn from './models/user_txn_model'
require('dotenv').config()

const handleStock = () => {
  const connection = mongoose.connection;
  connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
    console.log("The database is " + connection.name)
    runEveryTxn()
  })
  mongoose.connect(process.env.DB_CONN_STRING, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
}

const runEveryTxn = async () => {
  const userTxnDocs = await UserTxn.find({status: "waiting"}).exec()
  console.log(userTxnDocs)
  if(userTxnDocs) {
    for(let i = 0; i < userTxnDocs.length; i++) {
      let { user, stock_id, type, shares_number, bid_price } = userTxnDocs[i]
      if(type == "buy") {
        runBuy(user, stock_id, shares_number, bid_price)
      } else if(type == "sell") {
        runSell(user, stock_id, shares_number, bid_price)
      }
    }
  }
  process.exit()
}

const runBuy = async (uid, stock_id, shares_number, price) => {
  const stockDoc = await Stock.findOne({stock_id}).sort('-data_time').exec() //取的目前最新股票
  const hasStock = await UserStock.exists({user: uid, stock_id}) //確認有無擁有此股票
  if(hasStock) {
    let userStockDoc = await UserStock
      .findOneAndUpdate({
        user: uid,
        stock_id
      }, {
        stock: stockDoc.id,
        $inc: {shares_number}, //增加股數
        last_update: time
      },{
        new: true
      })
      .populate(['user','stock'])
      .exec()
    console.log(userStockDoc)
  } else {
    let newUserStock = new UserStock({
      user: uid,
      stock_id,
      stock: stockDoc.id,
      shares_number,
      last_update: time
    })
    let newUserStockDoc = await newUserStock.save()
    console.log(newUserStockDoc)
  }
}

const runSell = async (uid, stock_id, shares_number, price) => {
  const hasStock = await UserStock.exists({user: uid, stock_id})
  const stockDoc = await Stock.findOne({stock_id}).sort('-data_time').exec() //取得最新股票
  const last_update = Date(Date.now())

  if(hasStock) {
    let userStockDoc = await UserStock.findOne({user: uid, stock_id}).exec()
    if(userStockDoc.shares_number >= shares_number) {
      userStockDoc = await UserStock
        .findOneAndUpdate({
          user: uid,
          stock_id
        }, {
          stock: stockDoc.id,
          $inc: {shares_number: -shares_number}, //減少股數
          last_update
        },{
          new: true
        })
        .populate(['user','stock'])
        .exec()
      console.log(userStockDoc)
    } else {
      console.log(false)
    }
  } else {
    console.log(false)
  }
} 

handleStock()