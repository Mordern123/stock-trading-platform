import UserSearch from "../models/user_search_model";
import { handle_error } from "../common/error";
import Stock from "../models/stock_model";
import UserStock from "../models/user_stock_model";
import UserTxn from "../models/user_txn_model";
import Account from "../models/account_model";
import User from "../models/user_model";
import Global from "../models/global_model";
import moment from "moment";

//儲存使用者搜尋紀錄
export const add_user_search = async (user, stock) => {
	let doc = await new UserSearch({
		user: user._id,
		...stock,
	}).save();
};

//處理買股交易
export const runBuy = async (userTxnDoc, res) => {
	try {
		const { _id, user, stock_id, shares_number, stockInfo } = userTxnDoc;
		const stock_price = parseFloat(stockInfo.z); //下單成交價

		let stock_exists = await Stock.exists({ stock_id });

		//未存在此股票
		if (!stock_exists) {
			await updateTxn(_id, "fail", 0);
			return;
		}

		//出價小於收盤價(無法購買)
		// if(bid_price < stock_price) {
		//   await updateTxn(_id, 'fail', 1)
		//   return
		// }

		//餘額無法購買股票
		const txn_value = await checkBalance(user, stock_price, shares_number);
		if (txn_value == null) {
			await updateTxn(_id, "fail", 5);
			return;
		}

		//交易可執行
		const userHasStock = await UserStock.exists({ user, stock_id }); //確認用戶是否擁有此股票
		if (userHasStock) {
			//更新擁有股數
			let userStockDoc = await UserStock.findOneAndUpdate(
				{
					user,
					stock_id,
				},
				{
					stockInfo,
					$inc: { shares_number }, //增加股數
					last_update: moment(),
				},
				{
					new: true,
				}
			).exec();
		} else {
			//新增擁有股票
			let newUserStockDoc = await new UserStock({
				user,
				stock_id,
				stockInfo,
				shares_number,
				last_update: moment(),
			}).save();
		}

		await updateTxn(_id, "success", 6);
		await updateBalance(user, -txn_value); //購買後減少餘額
	} catch (error) {
		await updateTxn(_id, "error", 7);
		console.log(error);
	}
};

//更新交易狀態
export const updateTxn = async (id, status, CODE) => {
	let msg;
	switch (CODE) {
		case 0:
			msg = "STOCK_NOT_FOUND"; //不存在此股票
			break;
		case 1:
			msg = "BUY_PRICE_TOO_LOW"; //出價太低
			break;
		case 2:
			msg = "SOLD_PRICE_TOO_HIGH"; //售價太高
			break;
		case 3:
			msg = "STOCK_NOT_OWNED"; //用戶未擁有此股票
			break;
		case 4:
			msg = "SOLD_SHARES_EXCEED"; //售出股數超過持有股數
			break;
		case 5:
			msg = "INSUFFICIENT_BALANCE"; //餘額不足
			break;
		case 6:
			msg = "TXN_SUCCESS"; //交易成功
			break;
		case 7:
			msg = "OCCUR_ERROR"; //交易發生錯誤
			break;
	}
	const userTxnDoc = await UserTxn.findByIdAndUpdate(id, {
		status,
		txn_time: moment(),
		msg,
	});
};

//刪除收盤資料
export const remove_stock_data = async () => {
	try {
		let doc = await Global.findOne({ tag: "hongwei" }).lean().exec();
		let yesterday = moment(doc.stock_update).subtract(1, "days"); //刪除前一天以前的資料
		await Stock.deleteMany({ data_time: { $lte: yesterday.toDate() } }).exec();
		console.log("刪除收盤資料完成: " + moment().toLocaleString());
	} catch (error) {
		console.log(error);
	}
};
