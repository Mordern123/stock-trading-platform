import { crawl_tw_stock, txn_crawl_tw_stock } from "../website/twStock";
import { crawl_pcHome_stock, txn_crawl_pcHome_stock } from "../website/pcHome";
import { crawl_cnyes_stock, txn_crawl_cnyes_stock } from "../website/cnyes";
import { txn_error } from "./utils";
import { runTxn } from "../utils/txn";
import moment from "moment";

/*
 ? 0 ===> 台灣證券交易所
 ? 1 ===> PCHOME股票
 ? 2 ===> 鉅亨股票網
 */

// * 使用者搜尋爬蟲程序
export const task = async (user, stock_id, stock_name, res) => {
	let funcs = [crawl_tw_stock, crawl_pcHome_stock, crawl_cnyes_stock];
	let random_n = Math.floor(Math.random() * funcs.length); //隨機取數
	let website = get_website_name(random_n);

	funcs[random_n](user, stock_id, stock_name, res);

	console.log("----------------------------------------");
	console.log(`【${user.user_name}/${user._id}】 搜尋:`);
	console.log(`【${website}】 取得 ${stock_id} ! 時間: ${moment().toDate().toLocaleString()}`);
};

// * 系統取得股票爬蟲程序
export const txn_task = async (userTxnDoc, job = null) => {
	let funcs = [txn_crawl_tw_stock, txn_crawl_pcHome_stock, txn_crawl_cnyes_stock];
	// let funcs = [txn_crawl_cnyes_stock, txn_crawl_pcHome_stock];
	let random_n = Math.floor(Math.random() * funcs.length); //隨機取數
	// let random_n = 0;
	let website = get_website_name(random_n);
	let {
		stockInfo: { stock_id, stock_name },
	} = userTxnDoc;
	try {
		const stockData = await funcs[random_n](stock_id, stock_name);
		return stockData;
	} catch (error) {
		throw error;
	}
};

//取得網站名稱
const get_website_name = (n) => {
	let website = "";
	switch (n) {
		case 0:
			website = "台灣證券交易所";
			break;
		case 1:
			website = "PCHOME股票";
			break;
		case 2:
			website = "鉅亨股票網";
			break;
		default:
			break;
	}
	return website;
};
