export const convert_money_format = (n) => {
  let number = n ? n.toString() : "0"
  return number.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
}