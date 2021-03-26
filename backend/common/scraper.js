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

// * 系統處理交易搜尋爬蟲程序
export const txn_task = async (userTxnDoc, job = null) => {
	let {
		stockInfo: { stock_id, stock_name },
		type,
	} = userTxnDoc;
	let funcs = [txn_crawl_tw_stock, txn_crawl_pcHome_stock, txn_crawl_cnyes_stock];
	let random_n = Math.floor(Math.random() * funcs.length); //隨機取數
	let website = get_website_name(random_n);

	// * 取得即時股票資訊
	if (random_n === 1) {
		// ! PCHOME爬蟲要特別處理
		funcs[random_n](stock_id, stock_name, async (stockData) => {
			if (stockData) {
				console.log(
					`【${website}】 | ${stock_id} | 價格: ${
						stockData.z
					} | 時間: ${moment().toDate().toLocaleString()}`
				);
				await runTxn(type, userTxnDoc, stockData, job); //* 執行交易處理
			} else {
				await txn_error(userTxnDoc, job);
			}
		});
	} else {
		const stockData = await funcs[random_n](stock_id, stock_name);
		if (stockData) {
			console.log(
				`【${website}】 | ${stock_id} | 價格: ${
					stockData.z
				} | 時間: ${moment().toDate().toLocaleString()}`
			);
			await runTxn(type, userTxnDoc, stockData, job); //* 執行交易處理
		} else {
			await txn_error(userTxnDoc, job);
		}
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
