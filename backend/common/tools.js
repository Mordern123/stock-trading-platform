//字串轉換成數值
export const to_num = (str) => {
  let n = str.replace(",","") //去除逗點
  n = parseFloat(n)

  if(isNaN(n)) {
    return "0"
  } else {
    return n.toString()
  }
}

//含有K的字串轉換為數值
export const K_to_num = (str) => {
  if(str.includes("K")) {
    let n = to_num(str.replace("K", ""))
    return n.toString()
  } else {
    return to_num(str)
  }
}

//處理漲跌字串
export const to_ud = (str) => {
  if(str.includes("-")) {
    return to_num(str)
  } else {
    let n = to_num(str)
    return n === 0  ? "+" + n : n.toString()
  }
}
