import fs from "fs";
import axios from "axios";
import Stock from "../models/stock_model";
import Global from "../models/global_model";
import mongoose from "mongoose";
import moment from "moment";
require("dotenv").config();

export const getStock = async (time) => {
	try {
		console.log("取得收盤資訊日期為: ", moment(time).toLocaleString());
		const stock_exists = await Stock.exists({ data_time: time });
		if (stock_exists) {
			console.log(`${time} 收盤資料已取得`);
			return;
		}
		const res = await axios.get(
			`http://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=${convertDate(
				time
			)}&type=ALL`,
			{ headers: { Connection: "close" } }
		);
		// 沒有資料就停止程序
		if (res.data["data9"] == null) {
			console.log("查詢資料錯誤！");
			// process.exit()
		}
		const stockData = {
			cloumns: res.data["fields9"],
			data: res.data["data9"],
		};
		// 將資料加進自定義array
		const stock_array = [];
		stockData["data"].forEach((stock_item) => {
			stock_array.push({
				data_time: time,
				stock_id: stock_item[0],
				stock_name: stock_item[1],
				trading_volume: stock_item[2],
				txn_number: stock_item[3],
				turnover_value: stock_item[4],
				opening_price: stock_item[5],
				highest_price: stock_item[6],
				lowest_price: stock_item[7],
				closing_price: stock_item[8],
				up_down: getUpDown(stock_item[9]),
				up_down_spread: stock_item[10],
				last_buy_price: stock_item[11],
				last_buy_volume: stock_item[12],
				last_sell_price: stock_item[13],
				last_sell_volume: stock_item[14],
				PE_ratio: stock_item[15],
			});
		});
		// 資料匯入mongoDB
		if (stock_array.length > 0) {
			Stock.collection.insertMany(stock_array, () => {
				const update = async () => {
					let update_date = moment(time).format("YYYY-MM-DD");
					await Global.findOneAndUpdate(
						{ tag: "hongwei" },
						{ stock_update_time: update_date, stock_updated: true }
					).exec();
				};
				update(); //更新收盤資料日期
				console.log(`收盤股票新增完成，完成時間:【${moment().toLocaleString()}】`);
				console.log("----------------------------------------");
			});
		} else {
			return false;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
};

const write_json = (stockData) => {
	const json = JSON.stringify(stockData);
	fs.writeFile("stock.json", json, "utf8", (error) => {
		if (!error) {
			console.log("檔案已匯出");
		}
	});
};

const convertDate = (time) => {
	const year = time.getFullYear();
	const month = ("0" + (time.getMonth() + 1)).slice(-2);
	const date = ("0" + time.getDate()).slice(-2);
	return `${year}${month}${date}`;
};

const getUpDown = (str) => {
	if (str.includes("+")) {
		return "+";
	} else if (str.includes("-")) {
		return "-";
	} else {
		return "";
	}
};
