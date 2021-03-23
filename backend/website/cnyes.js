import cheerio from "cheerio";
import axios from "axios";
import moment from "moment";
import { add_user_search } from "../common/utils";
import { to_num, K_to_num, to_ud } from "../common/tools";
import { handle_error } from "../common/error";

//使用者搜尋爬蟲
export const crawl_cnyes_stock = async (user, stock_id, stock_name, res) => {
	try {
		const url = "https://invest.cnyes.com/twstock/tws/" + stock_id;
		let request_time = moment().toDate();
		let result = [];
		let obj;

		const response = await axios.get(url);
		const $ = cheerio.load(response.data);

		result.push($(".info-price").text());
		result.push($(".change-net").text());
		result.push($(".change-percent").text());

		let block = $(".profile-data");
		block.children("div").each((i, item) => {
			let value = $(item).children("div:nth-child(2)").text();
			result.push(value);
		});

		//處理當日高低
		let hl = result[4].replace(/\s/g, "").split("-");
		hl = hl.length === 2 ? hl : [0, 0];

		//檢查是否有值
		if (result.length === 0) throw new Error(404);
		result.forEach((value) => {
			if (value === undefined || value === null) {
				throw new Error(404);
			}
		});

		obj = {
			website: "cnyes",
			stock_id,
			stock_name,
			v: K_to_num(result[3]), //累積成交量
			o: to_num(result[7]), //開盤
			h: to_num(hl[1]), //當日最高
			l: to_num(hl[0]), //當日最低
			z: to_num(result[0]), //成交價
			y: to_num(result[6]), //昨收
			ud: to_ud(result[1]), //漲跌
			request_time,
		};

		await add_user_search(user, obj);
		res.json(obj);

		console.log("【鉅亨網 >>> 已回應】");
		console.log("----------------------------------------");
	} catch (error) {
		handle_error(error, res);
	}
};

//系統搜尋爬蟲
export const txn_crawl_cnyes_stock = async (stock_id, stock_name) => {
	try {
		const url = "https://invest.cnyes.com/twstock/tws/" + stock_id;
		let request_time = moment().toDate();
		let result = [];
		let obj;

		const response = await axios.get(url);
		const $ = cheerio.load(response.data);

		result.push($(".info-price").text());
		result.push($(".change-net").text());
		result.push($(".change-percent").text());

		let block = $(".profile-data");
		block.children("div").each((i, item) => {
			let value = $(item).children("div:nth-child(2)").text();
			result.push(value);
		});

		//處理當日高低
		let hl = result[4].replace(/\s/g, "").split("-");
		hl = hl.length === 2 ? hl : [0, 0];

		//檢查是否有值
		if (result.length === 0) throw new Error(404);
		result.forEach((value) => {
			if (value === undefined || value === null) {
				throw new Error(404);
			}
		});

		obj = {
			website: "cnyes",
			stock_id,
			stock_name,
			v: K_to_num(result[3]), //累積成交量
			o: to_num(result[7]), //開盤
			h: to_num(hl[1]), //當日最高
			l: to_num(hl[0]), //當日最低
			z: to_num(result[0]), //成交價
			y: to_num(result[6]), //昨收
			ud: to_ud(result[1]), //漲跌
			request_time,
		};

		console.log("【鉅亨網 >>> 已回應】");

		return obj;
	} catch (error) {
		console.log(error);
		return false;
	}
};
