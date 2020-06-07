import cookie from 'cookie'

export const convert_money_format = (n) => {
  let number = n ? n.toString() : "0"
  return number.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
}

export const check_status = async(api, data) => {
  try {
    const res = await api(data)
    return { res: res }

  } catch (error) {
    switch(error.response.status) {
      case 401:
        return { res: null, need_login: true, msg: '授權已過期，請重新登入'}
      default:
        return { res: null, need_login: true, msg: "發生錯誤，請稍後嘗試" }
    }
  }
}

export const check_cookie = (name) => {
  const cookies = cookie.parse(document.cookie)
  return cookies[name]
}