import { Router } from 'express'
import Stock from '../models/stock_model'
import UserStock from '../models/user_stock_model'
import UserTrack from '../models/user_track_model'
import UserTxn from '../models/user_txn_model'
import UserSearch from '../models/user_search_model'
import Account from '../models/account_model'
import moment from 'moment';
import { check_permission } from '../common/auth'
import { queue } from '../server'
import { task } from '../common/scraper'
import { handle_error } from '../common/error'

moment.locale('zh-tw');

const router = Router()

const get_all_stock = async (req, res) => {
  const { user, code } = await check_permission(req)

  if(!user) {
    res.clearCookie('user_token')
    res.status(code).send()
    return
  }

  const date = new Date('2020-04-16')
  const result = await Stock.find({data_time: date}).exec()
  res.json(result)
}

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
  const updateTime = moment().calendar()
  res.json({
    accountDocs,
    updateTime
  })
}

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
    newDoc.createdAt = moment(item.createdAt).calendar()
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
      userTrackDoc[i].track_time = moment(track_time).calendar()
      userTrackDoc[i].createdAt = moment(createdAt).startOf('hour').fromNow()
      userTrackDoc[i].updatedAt = moment(updatedAt).startOf('hour').fromNow()
    }
    
    res.json(userTrackDoc)
  } catch (error) {
    handle_error(error, res)
  }
  
}

//使用者追蹤股票
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

//取得及時股票資訊
const get_realTime_stock = async (req, res) => {

  const { user, code } = await check_permission(req)

  if(!user) {
    res.status(code).send()
    return
  }

  let stock_id = req.params.stock_id

  let stock = await Stock.findOne({stock_id}).limit(1).exec()

  if(stock) {
    await queue.add(() => task(user, stock.stock_id, stock.stock_name, res)); //加入排程
  } else {
    res.status(204).send()
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
      request_time: moment(item.request_time).calendar(),
      createdAt: moment(item.createdAt).startOf('hour').fromNow(),
      updatedAt: moment(item.updatedAt).startOf('hour').fromNow(),
    }
  })
  res.json(result)
}


router.route('/get/all').get(get_all_stock);
router.route('/get/:stock_id').get(get_realTime_stock);
router.route('/get/rank').post(get_stock_rank);
router.route('/user/get').post(get_user_stock);
router.route('/user/order/:type').post(user_place_order);
router.route('/user/track').post(user_track_stock);
router.route('/user/track/get').post(get_user_track);
router.route('/user/search').get(get_user_search);

export default router;