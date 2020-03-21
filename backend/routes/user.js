import { Router } from 'express'
import User from '../models/user_model'

const router = Router()

const new_user = async (req, res) => {
  try {
    const userData = req.body
    let result = await User.find({student_id: userData.student_id}).exec()
    if(result.length > 0) {
      res.json({status: false, payload: "學號已有人使用"});
      return
    }
    result = await User.find({email: userData.email}).exec()
    if(result.length > 0) {
      res.json({status: false, payload: "信箱已有人使用"});
      return
    }
    const newUser = new User(req.body);
    const userDoc = await newUser.save();
    res.json({status: true, payload: userDoc});
  } catch(e) {
    res.json({status: false, payload: e.toString()})
  }
}

const user_login = async (req, res) => {
  try {
    const loginData = req.body
    let userDoc = await User.findOne({student_id: loginData.student_id}).exec()
    if(userDoc) {
      if(loginData.password == userDoc.password) {
        res.json({status: true, payload: userDoc})
      } else {
        res.json({status: false, payload: "密碼錯誤"})
      }
    } else {
      res.json({status: false, payload: "沒有此使用者"})
    }
  } catch (e) {
    res.json({status: false, payload: e.toString()})
  }
}

router.route('/new').post(new_user);
router.route('/login').post(user_login);

export default router;
