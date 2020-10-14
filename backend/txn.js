import mongoose from "mongoose";
import Stock from "./models/stock_model";
import UserStock from "./models/user_stock_model";
import UserTxn from "./models/user_txn_model";
import Account from "./models/account_model";
import User from "./models/user_model";
import Global from "./models/global_model";
import moment from "moment";
import { closing_data_to_stock_info } from "./common/tools";
require("dotenv").config();

// * 伺服器運行處理交易執行起點
export const runEveryTxn = async () => {
	const globalDoc = await Global.findOne({ tag: "hongwei" }).lean().exec();
	const closing_time = moment(globalDoc.stock_update_time).hour(13).minute(30); //13:30收盤

	// ! 停止所有交易
	if (globalDoc.shutDown_txn) {
		console.log(`停止交易時間，不處理任何交易`);
		return;
	}

	// * 取得要處理的交易資料(由早到晚)
	const userTxnDocs = await UserTxn.find({
		status: "waiting", //等待處理的交易
		closing: true, //收盤後要處理
		order_time: { $lte: closing_time.toDate() } //下單時間在收盤之前
	})
		.sort({ date: "asc" })
		.exec();

	// * 處理每筆訂單
	for (let i = 0; i < userTxnDocs.length; i++) {
		console.log(`正在處理第${i + 1}筆...`);
		let { type } = userTxnDocs[i];
		await runTxn(type, userTxnDocs[i], null);
	}

	console.log(`所有交易處理完成`);
	console.log(`處理結束，共${userTxnDocs.length}筆`);
};

// * 伺服器運行計算股票總價值起點
export const runEveryUserStock = async () => {
	// * 更新所有用戶帳戶資訊
	const userAllDocs = await User.find().exec();

	for (let i = 0; i < userAllDocs.length; i++) {
		let { _id } = userAllDocs[i];
		await updateStockValue(_id);
	}

	console.log(`所有股票總價值更新完成`);
};

// * 處理交易入口
export const runTxn = async (type, userTxnDoc, stockData) => {
	const {
		_id,
		user,
		stock_id,
		bid_price,
		shares_number,
		order_type,
		stockInfo,
		closing,
	} = userTxnDoc;
	try {
		// ! 檢查訂單是否還存在
		let txn_exist = await UserTxn.exists({ _id: _id });
		if (!txn_exist) return;

		// ! 開盤市價交易，需要即時股票資訊
		if (order_type === "market" && !closing && !stockData) {
			await updateTxn(_id, "fail", 7);
			return;
		}

		// * 開盤/收盤預設變數
		let new_stockInfo; //使用的股票資料
		let yesterday_price; //昨日收盤價
		let current_price; //目前股價
		let stock_price; //運算股價
		let user_bid_price = bid_price || 0; //用戶出價

		if (closing) {
			//收盤處理
			const closing_data = await getStock(stock_id); // ? 最新收盤資料(上一次)
			const last_closing_data = await getStock(stock_id, 1); // ? 次新的收盤資料(上上一次)
			const current_stock_info = closing_data_to_stock_info(closing_data);

			// ! 檢查是否有收盤資料
			if (last_closing_data) {
				new_stockInfo = current_stock_info; // ? 最新收盤資料(上一次)
				yesterday_price = parseFloat(last_closing_data.closing_price) || 0; // ? 次新收盤價
				current_price = parseFloat(new_stockInfo.z) || 0; // ? 最新收盤價
				stock_price = parseFloat(new_stockInfo.z) || 0;
			} else {
				await updateTxn(_id, "fail", 7);
				return;
			}
		} else {
			//開盤處理
			// ? 如果即時股價為0則改用下單時抓尋時的股票資料
			new_stockInfo = parseFloat(stockData.z) > 0 ? stockData : stockInfo;
			yesterday_price = parseFloat(new_stockInfo.y) || 0;
			current_price = parseFloat(new_stockInfo.z) || 0;
			stock_price = parseFloat(new_stockInfo.z) || 0;
		}

		// ! 檢查股票價格不能為0
		if (!stock_price && !current_price) {
			await updateTxn(_id, "fail", 8);
			return;
		}

		// ! 檢查股票是否漲跌停不能交易
		let price_diff_percent;
		if (yesterday_price) {
			price_diff_percent =
				(Math.abs(current_price - yesterday_price) / yesterday_price) * 100;
		} else {
			price_diff_percent = (Math.abs(parseFloat(new_stockInfo.ud)) / yesterday_price) * 100;
		}
		// ? 市價交易超過9%就算漲跌停
		if (price_diff_percent >= 9) {
			//判斷漲跌停
			if (parseFloat(new_stockInfo.ud) >= 0) {
				await updateTxn(_id, "fail", 9);
			} else {
				await updateTxn(_id, "fail", 10);
			}
			return;
		}

		// * 執行買入or賣出
		if (type === "buy") {
			await runBuy(userTxnDoc, new_stockInfo, stock_price, user_bid_price);
		} else if (type === "sell") {
			await runSell(userTxnDoc, new_stockInfo, stock_price, user_bid_price);
		}
	} catch (error) {
		await updateTxn(_id, "error", 7);
		console.log(error);
	}
};

// * 處理買入交易
const runBuy = async (userTxnDoc, stockInfo, stock_price, user_bid_price) => {
	const { _id, user, stock_id, shares_number, order_type, closing } = userTxnDoc;
	try {
		// ! 收盤處理，出價小於收盤最低價(限價購買)
		if (closing) {
			if (order_type === "limit") {
				let lowest_price = parseFloat(stockInfo.l); //收盤最低點
				if (user_bid_price < lowest_price) {
					await updateTxn(_id, "fail", 1);
					return;
				}
			}
		}

		// ! 檢查餘額無法購買股票
		let total_value; //總金額
		let handling_fee; //手續費
		let txn_value = await checkBalance(user, stock_price, shares_number); //交易金額

		if (txn_value === null) {
			await updateTxn(_id, "fail", 5);
			return;
		} else {
			handling_fee = (txn_value * 0.1425) / 100; // ? 買入手續費收取0.1425%
			handling_fee = handling_fee < 20 ? 20 : handling_fee; // ? 不足20元算20
			total_value = txn_value + handling_fee;
		}

		// * 交易可執行
		let userHasStock = await UserStock.exists({ user, stock_id }); //確認用戶是否擁有此股票
		if (userHasStock) {
			//更新擁有股數
			await UserStock.findOneAndUpdate(
				{
					user,
					stock_id,
				},
				{
					stockInfo,
					$inc: { shares_number }, //增加股數
					last_update: moment().toDate(),
				},
				{
					new: true,
				}
			).exec();
		} else {
			//新增擁有股票
			await new UserStock({
				user,
				stock_id,
				stockInfo,
				shares_number,
				last_update: moment().toDate(),
			}).save();
		}

		// * 更新該用戶帳戶
		await updateAccount(user, -total_value);

		// * 更新交易狀態
		await updateTxn(_id, "success", 6, { handling_fee });
	} catch (error) {
		await updateTxn(_id, "error", 7);
		console.log(error);
	}
};

// * 處理賣出交易
const runSell = async (userTxnDoc, stockInfo, stock_price, user_bid_price) => {
	const { _id, user, stock_id, shares_number, order_type, closing } = userTxnDoc;
	try {
		// ! 檢查用戶是否擁有此股票
		let hasStock = await UserStock.exists({ user, stock_id });
		if (!hasStock) {
			updateTxn(_id, "fail", 3);
			return;
		}

		// ! 賣出股數超過擁有股數(無法賣出)
		let userStockDoc = await UserStock.findOne({ user, stock_id }).exec();
		if (shares_number > userStockDoc.shares_number) {
			updateTxn(_id, "fail", 4);
			return;
		}

		// ! 收盤處理，出價大於於收盤最高價(限價賣出)
		if (closing) {
			if (order_type === "limit") {
				let highest_price = parseFloat(stockInfo.h); //收盤最高點
				if (user_bid_price > highest_price) {
					await updateTxn(_id, "fail", 2);
					return;
				}
			}
		}

		// * 交易可執行
		let total_value; //總金額
		let handling_fee; //手續費
		let txn_value = stock_price * shares_number; //交易金額

		handling_fee = (txn_value * 0.4425) / 100; // ? 買入手續費收取0.1425% + 證券交易稅0.3%
		handling_fee = handling_fee < 20 ? 20 : handling_fee; // ? 不足20元算20
		total_value = txn_value - handling_fee;

		await UserStock.findOneAndUpdate(
			{
				user,
				stock_id,
			},
			{
				stockInfo,
				$inc: { shares_number: -shares_number }, //減少股數
				last_update: moment().toDate(),
			},
			{
				new: true,
			}
		).exec();

		// * 更新該用戶帳戶
		await updateAccount(user, total_value);

		// * 更新交易狀態
		await updateTxn(_id, "success", 6, { handling_fee });
	} catch (error) {
		await updateTxn(_id, "error", 7);
		console.log(error);
	}
};

// * 取得收盤股票資訊
export const getStock = async (stock_id, number = 0) => {
	let hasStock = await Stock.exists({ stock_id });
	if (hasStock) {
		const stockDocs = await Stock.find({ stock_id }).sort("-data_time").exec(); //取的目前最新股票
		const stockDoc = stockDocs[number];
		return stockDoc;
	} else {
		return null;
	}
};

// * 檢查餘額是否足夠
export const checkBalance = async (user, stock_price, n) => {
	const value = stock_price * n; //成交價 * 購買股數
	const accountDoc = await Account.findOne({ user }).exec();

	return accountDoc.balance >= value ? value : null;
};

// * 更新交易結果訊息
export const updateTxn = async (id, status, CODE, options) => {
	let msg;
	let handling_fee = 0;
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
			handling_fee = options.handling_fee; //手續費紀錄
			break;
		case 7:
			msg = "OCCUR_ERROR"; //交易發生錯誤
			break;
		case 8:
			msg = "ZERO_PRICE"; //交易股價為0
			break;
		case 9:
			msg = "LIMIT_UP"; //股票漲停不能交易
			break;
		case 10:
			msg = "LIMIT_DOWN"; //股票跌停不能交易
			break;
		default:
			msg = "OCCUR_ERROR"; //交易發生錯誤
			break;
	}
	await UserTxn.findByIdAndUpdate(id, {
		status,
		txn_time: moment().toDate(),
		msg,
		handling_fee,
	});
};

// * 更新某個用戶帳戶資訊
export const updateAccount = async (user, value) => {
	let userAllStocks = await UserStock.find({ user }).exec();

	//取得用戶擁有股票資訊
	for (let i = 0; i < userAllStocks.length; i++) {
		let { stock_id, shares_number, stockInfo } = userAllStocks[i];

		//刪除已賣空的股票
		if (shares_number === 0) {
			await UserStock.findOneAndDelete({ user, stock_id }).exec();
			continue;
		}
	}

	//取得用戶交易數量
	let txn_count = await UserTxn.countDocuments({ user }).exec();

	//更新擁有股票資料
	userAllStocks = await UserStock.find({ user }).exec(); //重新確認股票擁有數量

	await Account.findOneAndUpdate(
		{
			user,
		},
		{
			stock_number: userAllStocks.length,
			txn_count: txn_count,
			$inc: { balance: value }, //更新結餘
			last_update: moment().toDate(),
		},
		{
			new: true,
		}
	);
};

// * 更新某個用戶股票價值(用收盤價計算)
export const updateStockValue = async (user) => {
	let total_value = 0; //股票總價值
	let userAllStocks = await UserStock.find({ user }).exec();

	//取得用戶擁有股票資訊
	for (let i = 0; i < userAllStocks.length; i++) {
		let { stock_id, shares_number, stockInfo } = userAllStocks[i];
		let stock = await getStock(stock_id); //取得最新收盤價

		if (stock) {
			//計算股票總價值
			let stock_price = parseFloat(stock.closing_price) || 0;
			let stock_value = stock_price * shares_number; //計算最新成交價*擁有股數
			total_value += stock_value;
		}
	}
	let account = await Account.findOne({ user }).lean().exec();

	//更新帳戶資料
	await Account.findOneAndUpdate(
		{
			user,
		},
		{
			total_amount: account.balance + total_value,
			stock_value: total_value,
			last_value_update: moment().toDate(),
		},
		{
			new: true,
		}
	);
};
