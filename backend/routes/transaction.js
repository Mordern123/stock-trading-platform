import { Router } from 'express'
import Stock from '../models/stock_model'
import UserStock from '../models/user_stock_model'
import UserTrack from '../models/user_track_model'
import UserTxn from '../models/user_txn_model'
import moment from 'moment';

moment.locale('zh-tw');

const router = Router()

const get_all_txn = async (req, res) => {
  const txnDoc = await UserTxn.find().exec()
  res.json(txnDoc)
}

const get_user_txn = async (req, res) => {
  const { uid } = req.body
  const { type } = req.params

  if(!['success', 'fail', 'waiting', 'error'].includes(type)) {
    res.json(false)
    return
  }

  const txnData = await UserTxn.find({user: uid, status: type}).populate('stock').lean().exec()
  if(txnData) {
    const newTxnData = txnData.map(item => {
      let newDoc = item
      if(item.type == 'buy') {
        newDoc.type = "買入"
      } else if(item.type = 'sell') {
        newDoc.type = "賣出"
      }
      newDoc.updatedAt = moment(item.updatedAt).startOf('hour').fromNow()
      newDoc.createdAt = moment(item.createdAt).calendar()
      newDoc.order_time = moment(item.order_time).calendar()
      newDoc.txn_time = item.txn_time != null ? moment(item.txn_time).calendar() : "尚未處理交易"
      return newDoc
    })
    res.json(newTxnData)
  } else {
    res.json(false)
  }
}

router.route('/get/all').post(get_all_txn);
router.route('/get/user/:type').post(get_user_txn);

export default router; 
