import UserSearch from "../models/user_search_model";
import { handle_error } from "./error";
import Stock from "../models/stock_model";
import UserStock from "../models/user_stock_model";
import UserTxn from "../models/user_txn_model";
import Account from "../models/account_model";
import User from "../models/user_model";
import Global from "../models/global_model";
import moment from "moment";
import { updateTxn } from "../txn";

//儲存使用者搜尋紀錄
export const add_user_search = async (user, stock) => {
	let doc = await new UserSearch({
		user: user._id,
		...stock,
	}).save();
};

//刪除收盤資料
export const remove_stock_data = async () => {
	try {
		let doc = await Global.findOne({ tag: "hongwei" }).lean().exec();
		let yesterday = moment(doc.stock_update).subtract(1, "days"); //刪除前一天以前的資料
		await Stock.deleteMany({ data_time: { $lte: yesterday.toDate() } }).exec();
		console.log("刪除收盤資料完成: " + moment().toLocaleString());
		console.log("----------------------------------------");
	} catch (error) {
		console.log(error);
	}
};

// //處理買入交易(僅市價交易)
// export const txn_buy = async (userTxnDoc, stockData) => {
// 	try {
// 		const { _id, user, stock_id, shares_number, stockInfo } = userTxnDoc;

// 		// ! 檢查訂單是否還存在
// 		let txn_exist = await UserTxn.exists({ _id: _id });
// 		if (!txn_exist) return;

// 		// ! 如果即時股價為0則改用下單時抓尋時的股票資料
// 		const new_stockInfo = parseFloat(stockData.z) > 0 ? stockData : stockInfo;
// 		let stock_price = parseFloat(new_stockInfo.z); //即時股價
// 		let yesterday_price = parseFloat(new_stockInfo.y); //昨日收盤價

// 		// ! 檢查股價是否為0
// 		if (stock_price <= 0 || yesterday_price <= 0) {
// 			await updateTxn(_id, "fail", 8);
// 			return;
// 		}

// 		// !檢查餘額無法購買股票
// 		let txn_value = await checkBalance(user, stock_price, shares_number);
// 		if (txn_value === null) {
// 			await updateTxn(_id, "fail", 5);
// 			return;
// 		}

// 		// !檢查股票是否漲跌停不能交易
// 		let price_diff_percent = (Math.abs(stock_price - yesterday_price) / yesterday_price) * 100;
// 		//超過9%就算漲跌停
// 		if (price_diff_percent >= 9) {
// 			//判斷漲跌停
// 			if (parseFloat(new_stockInfo.ud) >= 0) {
// 				await updateTxn(_id, "fail", 9);
// 			} else {
// 				await updateTxn(_id, "fail", 10);
// 			}
// 			return;
// 		}

// 		// * 交易可執行
// 		const userHasStock = await UserStock.exists({ user, stock_id }); //確認用戶是否擁有此股票
// 		if (userHasStock) {
// 			//更新擁有股數
// 			await UserStock.findOneAndUpdate(
// 				{
// 					user,
// 					stock_id,
// 				},
// 				{
// 					stockInfo: new_stockInfo,
// 					$inc: { shares_number }, //增加股數
// 					last_update: moment(),
// 				},
// 				{
// 					new: true,
// 				}
// 			).exec();
// 		} else {
// 			//新增擁有股票
// 			await new UserStock({
// 				user,
// 				stock_id,
// 				stockInfo: new_stockInfo,
// 				shares_number,
// 				last_update: moment(),
// 			}).save();
// 		}

// 		await updateTxn(_id, "success", 6);
// 		await updateBalance(user, -txn_value); //購買後減少餘額
// 		console.log("----------------------------------------");
// 	} catch (error) {
// 		await updateTxn(_id, "error", 7);
// 		console.log(error);
// 		console.log("----------------------------------------");
// 	}
// };

// //處理賣出交易(僅市價交易)
// export const txn_sell = async (userTxnDoc, stockData) => {
// 	try {
// 		const { _id, user, stock_id, shares_number, stockInfo } = userTxnDoc;

// 		// ! 檢查訂單是否還存在
// 		let txn_exist = await UserTxn.exists({ _id: _id });
// 		if (!txn_exist) return;

// 		// ! 如果即時股價為0則改用下單時抓尋時的股票資料
// 		let new_stockInfo = parseFloat(stockData.z) > 0 ? stockData : stockInfo;
// 		let stock_price = parseFloat(new_stockInfo.z); //即時股價
// 		let yesterday_price = parseFloat(new_stockInfo.y); //昨日收盤價

// 		// ! 檢查股價是否為0
// 		if (stock_price <= 0 || yesterday_price <= 0) {
// 			await updateTxn(_id, "fail", 8);
// 			return;
// 		}

// 		// ! 用戶未擁有此股票
// 		let hasStock = await UserStock.exists({ user, stock_id });
// 		if (!hasStock) {
// 			updateTxn(_id, "fail", 3);
// 			return;
// 		}

// 		// ! 賣出股數超過擁有股數(無法賣出)
// 		let userStockDoc = await UserStock.findOne({ user, stock_id }).exec();
// 		if (shares_number > userStockDoc.shares_number) {
// 			updateTxn(_id, "fail", 4);
// 			return;
// 		}

// 		// !檢查股票是否漲跌停不能交易
// 		let price_diff_percent = (Math.abs(stock_price - yesterday_price) / yesterday_price) * 100;
// 		//超過9%就算漲跌停
// 		if (price_diff_percent >= 9) {
// 			//判斷漲跌停
// 			if (parseFloat(new_stockInfo.ud) >= 0) {
// 				await updateTxn(_id, "fail", 9);
// 			} else {
// 				await updateTxn(_id, "fail", 10);
// 			}
// 			return;
// 		}

// 		// * 交易可執行
// 		let txn_value = stock_price * shares_number;
// 		userStockDoc = await UserStock.findOneAndUpdate(
// 			{
// 				user,
// 				stock_id,
// 			},
// 			{
// 				stockInfo: new_stockInfo,
// 				$inc: { shares_number: -shares_number }, //減少股數
// 				last_update: moment(),
// 			},
// 			{
// 				new: true,
// 			}
// 		).exec();

// 		//更新完沒有擁有股份要刪除
// 		if (userStockDoc.shares_number === 0) {
// 			await UserStock.findByIdAndDelete(userStockDoc.id).exec();
// 		}

// 		await updateTxn(_id, "success", 6);
// 		await updateBalance(user, txn_value); //售出後增加餘額
// 		console.log("----------------------------------------");
// 	} catch (error) {
// 		await updateTxn(_id, "error", 7);
// 		console.log(error);
// 		console.log("----------------------------------------");
// 	}
// };

//處理錯誤交易
export const txn_error = async (userTxnDoc) => {
	const { _id } = userTxnDoc;
	await updateTxn(_id, "error", 7);
	console.log("----------------------------------------");
};
