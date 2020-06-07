import { Router } from 'express'
import Announcement from '../models/announce_model'
import { check_permission } from '../common/auth'

const router = Router()

const add_Announcement = async(req, res) => {
  try {
    const { user, code } = await check_permission(req)

    if(!user) {
      res.clearCookie('user_token')
      res.status(code).send()
      return
    }

    const result = await Announcement.create(req.body)
    res.json(result)
    
  } catch (error) {
    res.json("新增失敗!")
  }
}

const get_Announcement = async(req, res) => {

  const { user, code } = await check_permission(req)

  if(!user) {
    res.clearCookie('user_token')
    res.status(code).send()
    return
  }
  
  const result = await Announcement.find().populate('publisher', 'user_name').exec()
  res.json(result)
  
}

router.route('/list').get(get_Announcement);
router.route('/add_Announce').post(add_Announcement);


export default router;