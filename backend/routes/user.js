import { Router } from 'express'
import User from '../models/user_model'
import Account from '../models/account_model'
import UserSession from '../models/user_session_model'
import moment from 'moment'
import crypto from 'crypto'
import { check_permission } from '../common/auth'

const router = Router()

const new_user = async (req, res) => {
  try {
    const userData = req.body
    let isExist = await User.isExist({student_id: userData.student_id})

    if(isExist) {
      res.json({status: false, payload: "學號已有人使用"});
      return
    }

    result = await User.find({email: userData.email}).exec()
    if(result.length > 0) {
      res.json({status: false, payload: "信箱已有人使用"});
      return
    }

    const newUser = await new User(req.body).save();
    const newAccount = await new Account({
      user: newUser.id,
      balance: 1000000,
      last_update: moment()
    }).save();

    res.json({status: true, payload: {newUser, newAccount}});

  } catch(e) {
    res.json({status: false, payload: e.toString()})
  }
}

const user_login = async (req, res) => {
  try {
    const { student_id, hashValue } = req.body
    let userDoc = await User.findOne({student_id: student_id}).exec()
    if(userDoc) {
      //加密計算
      const key = userKey[student_id]
      const value = crypto.createHmac('sha512', key)
        .update(userDoc.password)
        .digest('hex')

      //隨機Token
      crypto.randomBytes(16, async(err, buffer) => {
        if(err) throw err
        var token = buffer.toString('hex'); //token值
        if(value === hashValue) {
          let options = {
            maxAge: 1000 * 60 * 60 * 24 * 7, // would expire after 7 days
            // httpOnly: true, // The cookie only accessible by the web server
            signed: true // Indicates if the cookie should be signed
          }
          let isExist = await UserSession.exists(({user: userDoc._id}))
          if(isExist) {
            await UserSession
              .updateOne({user: userDoc._id}, {cookie: token})
              .exec()
          } else {
            await new UserSession({
              user: userDoc._id,
              cookie: token
            }).save()
          }
          res.cookie("user_token", token, options)
        res.json({status: true, payload: userDoc})
      } else {
        res.json({status: false, payload: "密碼錯誤"})
      }
      });

    } else {
      res.json({status: false, payload: "沒有此使用者"})
    }
  } catch (e) {
    throw(e)
  }
}

const get_login_key = async (req, res) => {
  try {
    const { student_id } = req.body
    let isExist = await User.exists(({student_id: student_id}))

    if(isExist) {
      //隨機亂數Token
      crypto.randomBytes(16, function(err, buffer) {
        if(err) throw err
        var key = buffer.toString('hex');
        userKey[student_id] = key
        res.json(key)
      });
      
    } else {
      res.json(false)
    }
  } catch (error) {
    res.json({status: false, payload: error.toString()})
  }
}

const user_logout = async (req, res) => {
  try {
    const { user_token } = req.signedCookies
    await UserSession.updateOne({ cookie: user_token }, { cookie: ""})
    // res.cookies.set('user_token', {expires: Date.now()}) //清空cookie
    res.clearCookie('user_token')
    res.status(200).send()

  } catch(e) {
    throw e
  }
}

const get_user_data = async (req, res) => {
  const { user, code } = await check_permission(req)

  if(!user) {
    // res.cookies.set('user_token', {expires: Date.now()}) //清空cookie
    res.clearCookie('user_token')
    res.status(code).send()
    return
  }

  const userDoc = await User.findById(user._id).lean().exec()
  if(userDoc) {
    const newDoc = userDoc
    newDoc.updatedAt = moment(userDoc.updatedAt).startOf('hour').fromNow()
    newDoc.createdAt = moment(userDoc.createdAt).calendar()
    res.json(newDoc)
  } else {
    res.json(false)
  }
}

const update_user_data = async (req, res) => {
  const { user, code } = await check_permission(req)

  if(!user) {
    res.clearCookie('user_token')
    res.status(code).send()
    return
  }

  const { user_name, sex, birthday, email } = req.body
  const userDoc = await User
    .findByIdAndUpdate(user._id, 
    {
      user_name,
      sex,
      birthday,
      email
    },{
      new: true
    })
    .exec()

  if(userDoc) {
    res.json(true)
  } else {
    res.json(false)
  }
}

const get_user_account = async (req, res) => {
  const { user, code } = await check_permission(req)

  if(!user) {
    res.clearCookie('user_token')
    res.status(code).send()
    return
  }

  const accountDoc = await Account.findOne({user: user._id}).lean().exec()
  const { updatedAt, createdAt } = accountDoc
  if(accountDoc) {
    const newDoc = accountDoc
    newDoc.updatedAt = moment(updatedAt).startOf('hour').fromNow()
    newDoc.createdAt = moment(createdAt).calendar()
    newDoc.last_update = moment().calendar()
    res.json(newDoc) 
  } else {
    res.json(false)
  }
}

router.route('/new').post(new_user);
router.route('/login').post(user_login);
router.route('/logout').post(user_logout);
router.route('/loginKey').post(get_login_key);
router.route('/get').post(get_user_data);
router.route('/update').post(update_user_data);
router.route('/account').post(get_user_account);

export default router;
