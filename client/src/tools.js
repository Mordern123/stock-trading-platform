import cookie from 'cookie'

//顯示資產金額格式
export const convert_money_format = (n) => {
  let number = n ? n.toString() : "0"
  return number.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
}

//取得cookie值
export const check_cookie = (name) => {
  const cookies = cookie.parse(document.cookie)
  return cookies[name]
}

//處理錯誤
export const handle_error = (error, history) => {
  //http錯誤
  if(error.response) {
    switch(error.response.status) {
      case 401:
        history.replace("/login", { need_login: true }) //導向登入畫面
        alert("授權已過期，請重新登入")
        return
      case 404:
        alert("請求資料不存在")
        return
      default:
        alert("發生錯誤，請稍後嘗試")
        return
    }
  }

  //自定義錯誤
  switch(error.message) {
    case "204":
      alert("不存在此股票")
      return
    case "205":
      alert("收盤期間不可交易")
      return
    default: //未知錯誤
      console.log(error.message)
      alert("發生未知錯誤，請稍後嘗試")
  }

}

//轉換交易失敗訊息
export const transfer_fail_msg = (msg) => {
  let result = ""
  switch(msg) {
    case "STOCK_NOT_FOUND": 
      result = "不存在此股票"
      break
    case "BUY_PRICE_TOO_LOW":
      result = "出價太低"
      break
    case "SOLD_PRICE_TOO_HIGH":
      result = "售價太高"
      break
    case "STOCK_NOT_OWNED":
      result = "未擁有此股票"
      break
    case "SOLD_SHARES_EXCEED":
      result = "交易超過持有股數"
      break
    case "INSUFFICIENT_BALANCE":
      result = "餘額不足"
      break
    case "TXN_SUCCESS":
      result = "交易成功"
      break
    case "OCCUR_ERROR":
      result = "交易發生錯誤"
      break
    default:
      result = "交易發生錯誤"
      break
  }

  return result
}