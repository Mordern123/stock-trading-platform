import axios from "axios";
import moment from "moment";
import { add_user_search } from "../common/utils";
import { to_num, to_ud } from "../common/tools";
import { handle_error } from "../common/error";
import https from "https";

//使用者搜尋爬蟲
export const crawl_tw_stock = async (user, stock_id, stock_name, res) => {
	try {
		const agent = new https.Agent({
			rejectUnauthorized: false,
		});
		let res1 = await axios.get(
			`https://mis.twse.com.tw/stock/api/getStock.jsp?ch=${stock_id}.tw&json=1&delay=0`,
			{ httpsAgent: agent }
		);

		if (res1.data.msgArray.length === 0) throw new Error(404);

		let request_time = moment().toDate();
		let res2 = await axios.get(
			`https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${res1.data.msgArray[0].key}&json=1&delay=0`,
			{ httpsAgent: agent }
		);

		if (res2.data.msgArray.length === 0) throw new Error(404);

		let data = res2.data.msgArray[0];
		let bList = data.b.split("_"); //買進價格列表
		let bValue = bList.length > 0 ? bList.find((item) => Boolean(parseFloat(item))) || 0 : 0; //最新買進價格
		let zValue = data.z === "-" ? bValue : data.z;

		let obj = {
			website: "tw_stock",
			stock_id,
			stock_name,
			v: to_num(data.v), //累積成交量
			o: to_num(data.o), //開盤
			h: to_num(data.h), //當日最高
			l: to_num(data.l), //當日最低
			z: to_num(zValue), //成交價
			y: to_num(data.y), //昨收
			ud: to_ud(roundDecimal(parseFloat(zValue) - parseFloat(data.y), 1).toString()), //漲跌
			request_time,
		};
		await add_user_search(user, obj);
		res.json(obj);

		console.log("【台灣證券交易所 >>> 已回應】");
		console.log("----------------------------------------");
	} catch (error) {
		handle_error(error, res);
	}
};

//系統交易搜尋爬蟲
export const txn_crawl_tw_stock = async (stock_id, stock_name) => {
	try {
		const agent = new https.Agent({
			rejectUnauthorized: false,
		});
		let res1 = await axios.get(
			`https://mis.twse.com.tw/stock/api/getStock.jsp?ch=${stock_id}.tw&json=1&delay=0`,
			{ httpsAgent: agent }
		);

		if (res1.data.msgArray.length === 0) throw new Error(404);

		let request_time = moment().toDate();
		let res2 = await axios.get(
			`https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${res1.data.msgArray[0].key}&json=1&delay=0`,
			{ httpsAgent: agent }
		);

		if (res2.data.msgArray.length === 0) throw new Error(404);

		let data = res2.data.msgArray[0];
		let bList = data.b.split("_"); //買進價格列表
		let bValue = bList.length > 0 ? bList.find((item) => Boolean(parseFloat(item))) || 0 : 0; //最新買進價格
		let zValue = data.z === "-" ? bValue : data.z;

		let obj = {
			website: "tw_stock",
			stock_id,
			stock_name,
			v: to_num(data.v), //累積成交量
			o: to_num(data.o), //開盤
			h: to_num(data.h), //當日最高
			l: to_num(data.l), //當日最低
			z: to_num(zValue), //成交價
			y: to_num(data.y), //昨收
			ud: to_ud(roundDecimal(parseFloat(zValue) - parseFloat(data.y), 1).toString()), //漲跌
			request_time,
		};

		console.log("【台灣證券交易所 >>> 已回應】");

		return obj;
	} catch (error) {
		console.log(error);
		return false;
	}
};

var roundDecimal = function (val, precision) {
	return (
		Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) /
		Math.pow(10, precision || 0)
	);
};
