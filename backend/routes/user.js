import { Router } from 'express'
import User from '../models/user_model'

const router = Router()

const new_user = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const result = await newUser.save();
    res.json(result)
  } catch(e) {
    console.log(e)
  }
}

router.route('/new').post(new_user);

export default router;
