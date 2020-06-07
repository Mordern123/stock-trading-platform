import UserSession from '../models/user_session_model'

export const check_permission = async(request) => {
  const { user_token } = request.signedCookies //取的簽章cookie
  console.log(user_token)
  const {} = request.body
  const userDocs = await UserSession
    .find({ cookie: user_token })
    .populate('user')
    .lean()
    .exec()

  if(userDocs.length > 0) {
    const user = userDocs[0].user
    return {user: user, code: 200}
  } else {
    return {user: null, code: 401}
  }
}