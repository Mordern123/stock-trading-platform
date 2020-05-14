import { Router } from 'express'
import Stock from '../models/stock_model'
import UserStock from '../models/user_stock_model'
import UserTrack from '../models/user_track_model'
import UserTxn from '../models/user_txn_model'
import Account from '../models/account_model'
import moment from 'moment';

moment.locale('zh-tw');

const router = Router()

const get_all_stock = async (req, res) => {
  const date = new Date('2020-04-16')
  const result = await Stock.find({data_time: date}).exec()
  res.json(result)
}


const get_stock_rank = async (req, res) => {
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
          totalValue: 1
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
  const { uid } = req.body
  const userStockDoc = await UserStock
    .find({user: uid})
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

const user_place_order = async (req, res) => {
  try {
    if(req.params.type != 'buy' && req.params.type != 'sell') throw false
    const { uid, stock_id, shares_number, price } = req.body
    const time = Date(Date.now())

    const stockDoc = await Stock.findOne({stock_id}).sort('-data_time').exec() //取的目前最新股票

    const userTxnDoc = await new UserTxn({
      user: uid,
      stock_id,
      stock: stockDoc._id,
      type: req.params.type,
      shares_number,
      bid_price: price,
      order_time: time,
    }).save()
    
    res.json(userTxnDoc)

  } catch (error) {
    res.json(false)
  }
}

const get_user_track = async (req, res) => {
  try {
    const { uid } = req.body
    const userTrackDoc = await UserTrack
      .find({user: uid})
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
    
    console.log(userTrackDoc)
    res.json(userTrackDoc)
  } catch (error) {
    res.json(false)
  }
  
}

const user_track_stock = async (req, res) => {
  try {
    const { uid, stock_id } = req.body
    const hasStock = await UserTrack.exists({user: uid, stock_id})
    const track_time = Date(Date.now())
    let userTrackDoc;

    if(hasStock) {
      userTrackDoc = await UserTrack.findOneAndDelete({user: uid, stock_id}).exec()
      res.json(userTrackDoc)
    } else {
      userTrackDoc = await new UserTrack({
        user: uid,
        stock_id,
        track_time
      }).save()
    }
    res.json(userTrackDoc)
  } catch (error) {
    res.json(false)
  }
}

router.route('/get/all').get(get_all_stock);
router.route('/get/rank').post(get_stock_rank);
router.route('/user/get').post(get_user_stock);
router.route('/user/order/:type').post(user_place_order);
router.route('/user/track').post(user_track_stock);
router.route('/user/track/get').post(get_user_track);

export default router;