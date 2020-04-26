import { Router } from 'express'
import Stock from '../models/stock_model'
import UserStock from '../models/user_stock_model'
import UserTrack from '../models/user_track_model'
import UserTxn from '../models/user_txn_model'

const router = Router()

const get_all_stock = async (req, res) => {
  const date = new Date('2020-04-16')
  const result = await Stock.find({data_time: date}).exec()
  res.json(result)
}

const get_user_stock = async (req, res) => {
  const { uid } = req.body
  const result = await UserStock.find({user: uid}).populate(['user','stock']).exec()
  res.json(result)
}

const user_place_order = async (req, res) => {
  try {
    if(req.params.type != 'buy' && req.params.type != 'sell') throw false
    const { uid, stock_id, shares_number, price } = req.body
    const time = Date(Date.now())

    const userTxnDoc = await new UserTxn({
      user: uid,
      stock_id,
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
    const result = await UserTrack.find({user: uid}).exec()
    res.json(result)
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
router.route('/user/get').post(get_user_stock);
router.route('/user/order/:type').post(user_place_order);
router.route('/user/track').post(user_track_stock);
router.route('/user/track/get').post(get_user_track);

export default router; 