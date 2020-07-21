import { Router } from 'express'
import Stock from '../models/stock_model'
import UserStock from '../models/user_stock_model'
import UserTrack from '../models/user_track_model'
import UserTxn from '../models/user_txn_model'
import UserSearch from '../models/user_search_model'
import Account from '../models/account_model'
import Global from '../models/global_model'
import moment from 'moment';
import { check_permission } from '../common/auth'
import { queue } from '../server'
import { task } from '../common/scraper'
import { add_user_search } from '../common/stock'
import { handle_error } from '../common/error'

moment.locale('zh-tw');

const router = Router()

//取得收盤資料
const get_all_stock = async (req, res) => {
  try {
    const { user, code } = await check_permission(req)
    if(!user) {
      res.clearCookie('user_token')
      res.status(code).send()
      return
    }
  
    //取得收盤股票時間
    let global = await Global.findOne({tag: "hongwei"}).exec()
    let date = moment(global.stock_update).toDate()
    let result = await Stock.find({data_time: date}).exec()
    res.json(result)
    
  } catch (error) {
    handle_error(error, res)
  }
}

//取得收盤更新時間
const get_stock_updateTime = async (req, res) => {
  try {
    const { user, code } = await check_permission(req)
    if(!user) {
      res.clearCookie('user_token')
      res.status(code).send()
      return
    }
  
    //取得收盤股票時間
    let global = await Global.findOne({tag: "hongwei"}).exec()
    res.json(global.stock_update)
    
  } catch (error) {
    handle_error(error, res)
  }
}

//取得全部股票排名
const get_stock_rank = async (req, res) => {
  const { user, code } = await check_permission(req)

  if(!user) {
    res.clearCookie('user_token')
    res.status(code).send()
    return
  }

  let accountDocs = await Account
    .aggregate([
      {
        $addFields: {
          totalValue: {
            '$add' : [ '$stock_value', '$balance' ]
          }
        }
      },
      {
        $sort: {
          totalValue: -1
        }
      },
      { $limit : 50 }
    ]).exec()
  accountDocs = await Account.populate(accountDocs, 'user')

  const updateTime = moment().calendar(null, { lastWeek: 'dddd HH:mm' }) //ex: 星期三 10:55

  res.json({
    accountDocs,
    updateTime
  })
}

//取得用戶擁有股票
const get_user_stock = async (req, res) => {
  const { user, code } = await check_permission(req)

  if(!user) {
    res.clearCookie('user_token')
    res.status(code).send()
    return
  }

  const userStockDoc = await UserStock
    .find({user: user._id})
    .populate(['stock'])
    .lean()
    .exec()
  const userStockData = userStockDoc.map(item => {
    let newDoc = item
    newDoc.last_update = moment(item.last_update).startOf('hour').fromNow()
    newDoc.updatedAt = moment(item.updatedAt).startOf('hour').fromNow()
    newDoc.createdAt = moment(item.createdAt).calendar(null, { lastWeek: 'dddd HH:mm' }) //星期三 10:55
    return newDoc
  })
  res.json(userStockData)
}

//用戶下訂單
const user_place_order = async (req, res) => {
  try {
    const { user, code } = await check_permission(req)

    if(!user) {
      res.clearCookie('user_token')
      res.status(code).send()
      return
    }

    if(req.params.type != 'buy' && req.params.type != 'sell') throw false
    const { stock_id, stockInfo, shares_number } = req.body //前端傳送值
    const time = Date(Date.now())

    const userTxnDoc = await new UserTxn({
      user: user._id,
      stock_id,
      shares_number,
      stockInfo,
      type: req.params.type,
      order_time: time,
    }).save()
    
    res.json(userTxnDoc)

  } catch (error) {
    handle_error(error, res)
  }
}

//取得使用者追蹤股票資訊
const get_user_track = async (req, res) => {
  try {
    const { user, code } = await check_permission(req)

    if(!user) {
      res.clearCookie('user_token')
      res.status(code).send()
      return
    }

    const userTrackDoc = await UserTrack
      .find({user: user._id})
      .lean()
      .exec()
    for(let i = 0; i < userTrackDoc.length; i++) {
      let { stock_id, track_time, createdAt, updatedAt } = userTrackDoc[i]
      let stockDoc = await Stock.findOne({stock_id}).sort('-data_time').exec() //取的目前最新股票
      userTrackDoc[i].stock = stockDoc
      userTrackDoc[i].track_time = moment(track_time).calendar(null, { lastWeek: 'dddd HH:mm' }), //星期三 10:55
      userTrackDoc[i].createdAt = moment(createdAt).startOf('hour').fromNow()
      userTrackDoc[i].updatedAt = moment(updatedAt).startOf('hour').fromNow()
    }
    
    res.json(userTrackDoc)
  } catch (error) {
    handle_error(error, res)
  }
  
}

//用戶追蹤股票
const user_track_stock = async (req, res) => {
  try {
    const { user, code } = await check_permission(req)

    if(!user) {
      res.status(code).send()
      return
    }

    const { stock_id } = req.body
    const hasStock = await UserTrack.exists({user: user._id, stock_id})
    const track_time = Date(Date.now())
    let userTrackDoc;

    if(hasStock) {
      userTrackDoc = await UserTrack.findOneAndDelete({user: user._id, stock_id}).exec()
      res.json(userTrackDoc)
    } else {
      userTrackDoc = await new UserTrack({
        user: user._id,
        stock_id,
        track_time
      }).save()
    }
    res.json(userTrackDoc)
  } catch (error) {
    handle_error(error, res)
  }
}

//取得即時股票資訊
const get_realTime_stock = async (req, res) => {

  const { user, code } = await check_permission(req)
  if(!user) {
    res.status(code).send()
    return
  }

  //檢查是否收盤
  let global = await Global.findOne({ tag: "hongwei" }).exec()
  if(global.stock_closing) {
    res.status(205).send() //收盤中不可交易
    return
  }

  let stock_id = req.params.stock_id
  let stockData = await Stock.findOne({stock_id}).lean().exec()
  console.log(stockData)
  // let day = moment().day()
  // let isWeekend = (day === 6) || (day === 0) //判斷假日
  // let s = moment().hours(16).minutes(30) //今日下午4點30分
  // let e = moment().add(1, 'days').hours(9) //隔日早上9點
  // let is_between_close = moment().isBetween(s, e)

  if(stockData) {
    if(false) { //在收盤期間
      try {
        let today_str = moment().format('YYYY-MM-DD') //今日最小單位
        let today = moment(today_str).toDate()
        let stock = await Stock.findOne({ stock_id, data_time: today}).exec() //找尋今日收盤資訊
        let obj = {
          website: 'close',
          stock_id,
          stock_name: stock.stock_name,
          v: stock.txn_number, //累積成交量
          o: stock.opening_price, //開盤
          h: stock.highest_price, //當日最高
          l: stock.lowest_price, //當日最低
          z: stock.closing_price, //收盤價
          y: stock.closing_price, //昨收(已收盤和收盤價一樣)
          ud: (stock.up_down + stock.up_down_spread) || 0, //漲跌
          request_time: moment(),
        }

        await add_user_search(user, obj) //儲存搜尋紀錄

        res.json(obj)
  
      } catch (error) {
        handle_error(error, res)
      }
    } else {
      //取得最新資料
      await queue.add(() => task(user, stockData.stock_id, stockData.stock_name, res)); //加入排程
    }

  } else {
    res.status(204).send() //找不到股票
  }
}

//取得使用者搜尋紀錄
const get_user_search = async(req, res) => {
  const { user, code } = await check_permission(req)
  if(!user) {
    res.status(code).send()
    return
  }
  let docs = await UserSearch.find({ user: user._id }).sort({request_time: 'desc'}).lean().exec()
  let result = docs.map((item) => {
    return {
      ...item,
      request_time: moment(item.request_time).calendar(null, { lastWeek: '這dddd HH:mm' }), //星期三 10:55,
      createdAt: moment(item.createdAt).startOf('hour').fromNow(),
      updatedAt: moment(item.updatedAt).startOf('hour').fromNow(),
    }
  })
  res.json(result)
}

router.route('/get/all').get(get_all_stock);
router.route('/get/updateTime').get(get_stock_updateTime);
router.route('/get/:stock_id').get(get_realTime_stock);
router.route('/get/rank').post(get_stock_rank);
router.route('/user/get').post(get_user_stock);
router.route('/user/order/:type').post(user_place_order);
router.route('/user/track').post(user_track_stock);
router.route('/user/track/get').post(get_user_track);
router.route('/user/search').get(get_user_search);

export default router;