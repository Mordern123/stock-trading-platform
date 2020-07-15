import { crawl_tw_stock } from '../website/twStock'
import { crawl_pcHome_stock } from '../website/pcHome'
import { crawl_cnyes_stock } from '../website/cnyes'

//爬蟲程序
export const task = async(user, stock_id, stock_name, res) => {
  let funcs = [crawl_tw_stock, crawl_pcHome_stock, crawl_cnyes_stock]
  let random_n =  Math.floor(Math.random() * funcs.length); //隨機取數
  funcs[random_n](user, stock_id, stock_name, res)

  console.log(stock_id + " send to " + random_n + " ! " + new Date(Date.now()))
}