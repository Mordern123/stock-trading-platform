import schedule from 'node-schedule'
import { runEveryTxn } from './txn'
import { getStock } from './getStock'
import moment from 'moment'
import Global from './models/global_model'


//處理股票交易排程
export const start_txn_schedule = () => {
  var rule = new schedule.RecurrenceRule();
  rule.minute = new schedule.Range(0, 59, 10) //每10分鐘一次
  rule.hour = new schedule.Range(8, 13) //每天9點到14點
  rule.dayOfWeek = new schedule.Range(1, 5) //每個禮拜一到五

  schedule.scheduleJob(rule, function(fireDate){
    console.log(`交易開始處理時間: ${fireDate}`)
    runEveryTxn()
  });
}

//處理收盤資料排程(14:35)
export const start_get_closingStock_schedule = () => {
  var rule = new schedule.RecurrenceRule();
  rule.minute = 35
  rule.hour = 14
  rule.dayOfWeek = new schedule.Range(1, 5) //每個禮拜一到五

  schedule.scheduleJob(rule, function(fireDate){
    console.log(`收盤資料抓取時間: ${fireDate}`)
    let today_str = moment().format('YYYY-MM-DD')
    let today = moment(today_str).toDate()
    getStock(today)
  });
}

//處理進入收盤狀態排程(13:30)
export const start_closing_schedule = () => {
  var rule = new schedule.RecurrenceRule();
  rule.minute = 30
  rule.hour = 13
  rule.dayOfWeek = new schedule.Range(1, 5) //每個禮拜一到五

  schedule.scheduleJob(rule, function(fireDate){
    const change = async() => {
      await Global.findOneAndUpdate({tag: "hongwei"}, {stock_closing: true}).exec()
    }
    console.log(`進入收盤時間: ${fireDate}`)
    change()
  });
}

//處理進入開盤狀態排程(9:00)
export const start_opening_schedule = () => {
  var rule = new schedule.RecurrenceRule();
  rule.minute = 0
  rule.hour = 9
  rule.dayOfWeek = new schedule.Range(1, 5) //每個禮拜一到五

  schedule.scheduleJob(rule, function(fireDate){
    const change = async() => {
      await Global.findOneAndUpdate({tag: "hongwei"}, {stock_closing: false}).exec()
    }
    console.log(`進入開盤時間: ${fireDate}`)
    change()
  });
}
