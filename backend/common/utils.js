import UserSearch from "../models/user_search_model";
import { handle_error } from "./error";
import Stock from "../models/stock_model";
import Global from "../models/global_model";
import moment from "moment";
import { updateTxn } from "../txn";

//儲存使用者搜尋紀錄
export const add_user_search = async (user, stock) => {
	let doc = await new UserSearch({
		user: user._id,
		...stock,
		request_time: moment().toDate(),
	}).save();
};

//刪除收盤資料
export const remove_stock_data = async () => {
	try {
		let doc = await Global.findOne({ tag: "hongwei" }).lean().exec();
		let yesterday = moment(doc.stock_update_time).subtract(2, "days"); // ? 刪除前二天以前的資料(為了計算前後收盤價差)
		await Stock.deleteMany({ data_time: { $lte: yesterday.toDate() } }).exec();
		console.log("刪除收盤資料完成: " + moment().toLocaleString());
		console.log("----------------------------------------");
	} catch (error) {
		console.log(error);
	}
};

//處理錯誤交易
export const txn_error = async (userTxnDoc) => {
	const { _id } = userTxnDoc;
	await updateTxn(_id, "error", 7);
	console.log("----------------------------------------");
};
