import cheerio from "cheerio";
import rest from "restler";
import moment from "moment";
import { add_user_search } from "../common/utils";
import { to_num, to_ud } from "../common/tools";
import { handle_error } from "../common/error";
import step from "step";

// 使用者搜尋成功回傳資料處理
const complete = async (data, res, user, stock_id, stock_name, request_time) => {
	try {
		var result = [];

		const $ = cheerio.load(data);
		const block1 = $("#stock_info_data_a");
		const block2 = $(".sdt-content table tr");
		let obj;

		block1.children("span").each((i, item) => {
			result.push($(item).text());
		});
		block2.children("td").each((i, item) => {
			result.push($(item).text());
		});

		//檢查是否有值
		if (result.length === 0) throw new Error(404);
		result.forEach((value) => {
			if (value === undefined || value === null) {
				throw new Error(404);
			}
		});

		obj = {
			website: "pcHome",
			stock_id,
			stock_name,
			v: to_num(result[5]), //累積成交量
			o: to_num(result[10]), //開盤
			h: to_num(result[11]), //當日最高
			l: to_num(result[12]), //當日最低
			z: to_num(result[0]), //成交價
			y: to_num(result[13]), //昨收
			ud: to_ud(result[4]), //漲跌
			request_time,
		};
		await add_user_search(user, obj);
		res.json(obj);

		console.log("【PCHOME股票 >>> 已回應】");
		console.log("----------------------------------------");
	} catch (error) {
		handle_error(error, res);
	}
};

// 使用者搜尋爬蟲執行點
export const crawl_pcHome_stock = async (user, stock_id, stock_name, res) => {
	try {
		const url = `https://pchome.megatime.com.tw/stock/sid${stock_id}.html`;
		let request_time = moment().toDate();

		rest.post(url, {
			multipart: true,
			data: {
				is_check: 1,
			},
		})
			.on("complete", async (data) => {
				complete(data, res, user, stock_id, stock_name, request_time);
			})
			.on("fail", function (data, response) {
				res.json(false);
			})
			.on("error", function (error, response) {
				res.json(false);
				console.log(error);
			});
	} catch (error) {
		handle_error(error, res);
	}
};

// 系統搜尋成功回傳資料處理
const txn_complete = async (data, stock_id, stock_name, request_time) => {
	try {
		var result = [];

		const $ = cheerio.load(data);
		const block1 = $("#stock_info_data_a");
		const block2 = $(".sdt-content table tr");
		let obj;

		block1.children("span").each((i, item) => {
			result.push($(item).text());
		});
		block2.children("td").each((i, item) => {
			result.push($(item).text());
		});

		//檢查是否有值
		if (result.length === 0) throw new Error(404);
		result.forEach((value) => {
			if (value === undefined || value === null) {
				throw new Error(404);
			}
		});

		obj = {
			website: "pcHome",
			stock_id,
			stock_name,
			v: to_num(result[5]), //累積成交量
			o: to_num(result[10]), //開盤
			h: to_num(result[11]), //當日最高
			l: to_num(result[12]), //當日最低
			z: to_num(result[0]), //成交價
			y: to_num(result[13]), //昨收
			ud: to_ud(result[4]), //漲跌
			request_time,
		};

		console.log("【PCHOME股票 >>> 已回應】");

		return obj;
	} catch (error) {
		console.log(error);
		return error;
	}
};

// 系統搜尋爬蟲執行點
export const txn_crawl_pcHome_stock = async (stock_id, stock_name, execute) => {
	try {
		const url = `https://pchome.megatime.com.tw/stock/sid${stock_id}.html`;
		let request_time = moment().toDate();

		rest.post(url, {
			multipart: true,
			data: {
				is_check: 1,
			},
		})
			.on("complete", async (data) => {
				let result = await txn_complete(data, stock_id, stock_name, request_time);
				execute(result);
				return result;
			})
			.on("fail", function (data, response) {
				console.log(error);
				return false;
			})
			.on("error", function (error, response) {
				console.log(error);
				return false;
			});
	} catch (error) {
		console.log(error);
		return false;
	}
};
