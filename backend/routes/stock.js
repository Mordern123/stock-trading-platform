import { Router } from 'express'
import Stock from '../models/stock_model'

const router = Router()

const get_all_stock = async (req, res) => {
  const date = new Date('2020-04-16')
  const result = await Stock.find({data_time: date}).exec()
  res.json(result)
}

router.route('/get/all').get(get_all_stock);

export default router; 