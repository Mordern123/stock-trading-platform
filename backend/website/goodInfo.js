import cheerio from 'cheerio'
import axios from 'axios'
import moment from 'moment'

export const crawl_goodInfo_stock = async(stock_id, stock_name, res) => {
  try {
    const url = 'https://goodinfo.tw/StockInfo/StockDetail.asp?STOCK_ID=' + stock_id
    let request_time = moment().toDate()

    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    const table = $('table.solid_1_padding_3_1_tbl > tbody')
    var fields = []
    var values = []
    table.children('tr').each((i, tr) => {
      if(i === 1 || i === 3 || i === 5) {
        $(tr).children('td').each((j, td) => {
          fields.push($(td).text())
        })
      } else if(i === 2 || i === 4 || i === 6) {
        $(tr).children('td').each((j, td) => {
          values.push($(td).text())
        })
      }
    })
    // console.log(stock_id + ' completed! ' + new Date(Date.now()), {fields, values})
    res.json({
      website: 'goodInfo',
      stock_id,
      stock_name,
      v: values[8], //累積成交量
      o: values[5], //開盤
      h: values[6], //當日最高
      l: values[7], //當日最低
      z: values[0], //成交價
      ud: values[2], //漲跌
      y: values[1], //昨收
      request_time,
    }) 
  } catch(e) {
    res.json(false)
    console.log(e)
  }
}