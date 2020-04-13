import { Router } from 'express'
import Announcement from '../models/announce_model'

const router = Router()

const add_Announcement = async(req, res) => {
  try {
    const result = await Announcement.create(req.body)
    res.json(result)
  } catch (error) {
    res.json("新增失敗!")
  }
}

const get_Announcement = async(req, res) => {
  const result = await Announcement.find().populate('publisher', 'user_name').exec()
  res.json(result)
}

router.route('/list').get(get_Announcement);
router.route('/add_Announce').post(add_Announcement);


export default router;