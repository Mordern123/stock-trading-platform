import mongoose from 'mongoose'
import Stock from './models/stock_model'
import UserStock from './models/user_stock_model'
import UserTxn from './models/user_txn_model'
import Account from './models/account_model'
import User from './models/user_model'
import moment from 'moment'
require('dotenv').config()

const handleStock = () => {
  const connection = mongoose.connection;
  connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
    console.log("The database is " + connection.name)
    runEveryTxn()
  })
  mongoose.set('useFindAndModify', false);
  mongoose.connect(process.env.DB_CONN_STRING, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
}

const runEveryTxn = async () => {
  const userTxnDocs = await UserTxn.find({status: "waiting"}).exec() //取得所有等待交易資料
  console.log(userTxnDocs)

  //處理每筆訂單
  if(userTxnDocs) {
    for(let i = 0; i < userTxnDocs.length; i++) {
      console.log(`正在處理第${i+1}筆...`)
      let { type } = userTxnDocs[i]
      if(type == "buy") {
        await runBuy(userTxnDocs[i])
      } else if(type == "sell") {
        await runSell(userTxnDocs[i])
      }
    }
  }

  //更新所有用戶帳戶資訊
  const userAllDocs = await User.find().exec()
  console.log(userAllDocs)

  if(userAllDocs) {
    for(let i = 0; i < userAllDocs.length; i++) {
      let { _id } = userAllDocs[i]
      await updateStockValue(_id)
    }
  }
  console.log(`帳戶更新完成`)
  console.log(`處理結束，共${userTxnDocs.length}筆`)
  process.exit()
}

const runBuy = async (userTxnDoc) => {
  const { _id, user, stock_id, bid_price, shares_number } = userTxnDoc
  try {
    const stockDoc = await getStock(stock_id) //取得要購買股票
    console.log(stockDoc)

    //未存在此股票
    if(stockDoc == null) {
      await updateTxn(_id, 'fail', 0)
      return
    }

    //出價小於收盤價(無法購買)
    if(bid_price < stockDoc.closing_price) {
      await updateTxn(_id, 'fail', 1)
      return
    }

    //餘額無法購買股票
    const txn_value = await checkBalance(user, stockDoc, shares_number)
    if(txn_value == null) {
      await updateTxn(_id, 'fail', 5)
      return
    }

    //交易可執行
    const userHasStock = await UserStock.exists({user, stock_id}) //確認有無擁有此股票
    if(userHasStock) {
      //更新擁有股數
      let userStockDoc = await UserStock
        .findOneAndUpdate({
          user,
          stock_id
        }, {
          stock: stockDoc._id,
          $inc: {shares_number}, //增加股數
          last_update: Date(Date.now())
        },{
          new: true
        })
        .exec()
    } else {
      //新增擁有股票
      let newUserStockDoc = await new UserStock({
        user,
        stock_id,
        stock: stockDoc._id,
        shares_number,
        last_update: Date(Date.now())
      }).save()
    }

    await updateTxn(_id, 'success', 6)
    await updateBalance(user, -txn_value) //購買後減少餘額

  } catch (error) {
    await updateTxn(_id, 'error', 7)
    console.log(error)
  }
}

const runSell = async (userTxnDoc) => {

  try {
    const { _id, user, stock_id, bid_price, shares_number } = userTxnDoc
    const stockDoc = await getStock(stock_id) //取得要購買股票

    //未存在此股票
    if(stockDoc == null) {
      updateTxn(_id, 'fail', 0)
      return
    }

    //用戶未擁有此股票
    const hasStock = await UserStock.exists({user, stock_id})
    if(!hasStock) {
      updateTxn(_id, 'fail', 3)
      return
    }

    //出價大於收盤價(無法賣出)
    if(bid_price > stockDoc.closing_price) {
      updateTxn(_id, 'fail', 2)
      return
    }

    //賣出股數超過擁有股數(無法賣出)
    let userStockDoc = await UserStock.findOne({user, stock_id}).exec()
    if(shares_number > userStockDoc.shares_number) {
      updateTxn(_id, 'fail', 4)
      return
    }

    //可正常交易
    const txn_value = stockDoc.closing_price * shares_number
    userStockDoc = await UserStock
      .findOneAndUpdate({
        user,
        stock_id
      }, {
        stock: stockDoc._id,
        $inc: {shares_number: -shares_number}, //減少股數
        last_update: Date(Date.now())
      },{
        new: true
      })
      .exec()

    await updateTxn(_id, 'success', 6)
    await updateBalance(user, txn_value) //售出後增加餘額

  } catch (error) {
    await updateTxn(_id, 'error', 7)
    console.log(error)
  }
  
}

const getStock = async (stock_id) => {
  let hasStock = await Stock.exists({stock_id})
  if(hasStock) {
    const stockDoc = await Stock.findOne({stock_id}).sort('-data_time').exec() //取的目前最新股票
    return stockDoc
  } else {
    return null
  }
}

const checkBalance = async (user, stockDoc, n) => {
  const { closing_price } = stockDoc
  const value = closing_price * n //收盤價*購買張數
  const accountDoc = await Account.findOne({user}).exec()

  return accountDoc.balance >= value ? value : null
}

const updateTxn = async (id, status, CODE) => {
  let msg;
  switch(CODE) {
    case 0: 
      msg = "STOCK_NOT_FOUND" //不存在此股票
      break
    case 1:
      msg = "BUY_PRICE_TOO_LOW" //出價太低
      break
    case 2:
      msg = "SOLD_PRICE_TOO_HIGH" //售價太高
      break
    case 3:
      msg = "STOCK_NOT_OWNED" //用戶未擁有此股票
      break
    case 4:
      msg = "SOLD_SHARES_EXCEED" //售出股數超過持有股數
      break
    case 5:
      msg = "INSUFFICIENT_BALANCE" //餘額不足
      break
    case 6:
      msg = "TXN_SUCCESS" //交易成功
      break
    case 7:
      msg = "OCCUR_ERROR" //交易發生錯誤
      break
  }
  const userTxnDoc = await UserTxn
    .findByIdAndUpdate(id, {
      status,
      txn_time: Date(Date.now()),
      msg
    })
}

const updateBalance = async (user, value) => {
  const accountDoc = await Account.findOneAndUpdate({
    user
  },{
    $inc: {balance: value}, //更新結餘
    last_update: moment()
  },{
    new: true
  })
}

const updateStockValue = async (user) => {
  let total_value = 0
  let userAllStocks = await UserStock.find({user}).exec()

  for(let i = 0; i < userAllStocks.length; i++) {
    const { stock_id, shares_number } = userAllStocks[i]
    //刪除已賣空的股票
    if(shares_number == 0) {
      await UserStock.findOneAndDelete({user, stock_id}).exec()
      continue
    }
    //取得最新股票並計算價值
    const stockDoc = await getStock(stock_id) 
    if(stockDoc) {
      const stock_value = stockDoc.closing_price * shares_number //計算目前最新收盤價*擁有股數
      total_value += stock_value
    }
  }

  //更新帳戶資料
  userAllStocks = await UserStock.find({user}).exec() //重新確認股票擁有數量
  await Account.findOneAndUpdate({
    user
  },{
    stock_number: userAllStocks.length,
    stock_value: total_value,
    last_update: moment()
  },{
    new: true
  })

}

// start...
handleStock()