import { Router } from 'express'
import Stock from '../models/stock_model'
import UserStock from '../models/user_stock_model'
import UserTrack from '../models/user_track_model'
import UserTxn from '../models/user_txn_model'
import User from '../models/user_model'
import moment from 'moment';
import { check_permission } from '../common/auth'

moment.locale('zh-tw');

const router = Router()

const get_all_txn = async (req, res) => {
  const { user, code } = await check_permission(req)
  const { day } = req.query

  if(!user) {
    res.clearCookie('user_token')
    res.status(code).send()
    return
  }

  if(day) {
    let s = moment().subtract(parseInt(day), 'days').format("YYYYMMDD") //起始時間
    let e = moment().add(1, 'days').format("YYYYMMDD") //結束時間取明天
    let txnDoc = await UserTxn.find({
      order_time: {
        $gte: moment(s),
        $lt: moment(e)
      }
    }).exec()
    
    res.json(txnDoc)

  } else {
    const txnDoc = await UserTxn.find().exec()
    res.json(txnDoc)
  }
}

const get_user_txn = async (req, res) => {
  const { type } = req.params
  const { pure } = req.query
  const { user, code } = await check_permission(req)

  if(!['all', 'success', 'fail', 'waiting', 'error'].includes(type)) {
    res.json(false)
    return
  }

  if(!user) {
    res.clearCookie('user_token')
    res.status(code).send()
    return
  }

  const conditions = (type == 'all')
    ? { user: user._id }
    : { status: type }

  const txnData = await UserTxn
    .find(conditions)
    .populate('stock')
    .sort({
      createdAt: -1,
    })
    .lean()
    .exec()

  if(txnData) {
    if(pure) { //純資料
      res.json(txnData)

    } else {
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
    }
  } else {
    res.json(false)
  }
}

const get_class_txn_avg = async (req, res) => {
  const { user, code } = await check_permission(req)

  if(!user) {
    res.clearCookie('user_token')
    res.status(code).send()
    return
  }

  const { day } = req.body
  const dayString = moment().format('YYYY-MM-DD'); //轉換為最小單位為天
  const startDay = moment(dayString).subtract(day, 'days'); //取得instance
  const countObj = {}
  const avgObj = {}

  const userCount = await User.countDocuments()
  
  const txnDoc = await UserTxn
    .find({
        order_time: {
          $gte: startDay.toDate()
        }
      })
    .sort({
        order_time: 1
      })
    .exec()

  if(txnDoc) {
    txnDoc.forEach(txn => {
      let ds = moment(txn.order_time).format('YYYY-MM-DD');
      let txnCount = countObj[ds] || 0
      countObj[ds] = txnCount +　1 //計算交易次數
    })

    //計算平均每位學生的交易次數
    for(let key in countObj) {
      avgObj[key] = Math.round((countObj[key] / userCount) * 10) / 10
    }
  }

  res.json(avgObj)
}

router.route('/get/all').get(get_all_txn);
router.route('/get/user/:type').get(get_user_txn);
router.route('/get/class/avg').get(get_class_txn_avg);

export default router; 
