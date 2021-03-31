import schedule from "node-schedule";
import { runEveryTxn, runEveryUserStock, runEveryPendingTxn } from "./txn";
import { remove_stock_data } from "../common/utils";
import { getStock } from "./getStock";
import moment from "moment";
import Global from "../models/global_model";
import {
	OPENING_HOUR,
	OPENING_MINUTE,
	CLOSING_HOUR,
	CLOSING_MINUTE,
	PENDING_ORDER_START_HOUR,
	PENDING_ORDER_END_HOUR,
	PENDING_ORDER_MINUTE,
	CALCULATE_STOCK_VALUE_HOUR_1,
	CALCULATE_STOCK_VALUE_MINUTE_1,
	CALCULATE_STOCK_VALUE_HOUR_2,
	CALCULATE_STOCK_VALUE_MINUTE_2,
	GET_CLOSING_STOCK_HOUR,
	GET_CLOSING_STOCK_MINUTE,
	REMOVE_CLOSING_STOCK_DAY,
	REMOVE_CLOSING_STOCK_HOUR,
	REMOVE_CLOSING_STOCK_MINUTE,
} from "../common/time";

// * 盤中定時處理訂單(每日10:00~13:30)
export const start_pending_txn_schedule = () => {
	var rule = new schedule.RecurrenceRule();
	rule.hour = new schedule.Range(PENDING_ORDER_START_HOUR, PENDING_ORDER_END_HOUR);
	rule.minute = new schedule.Range(0, 59, PENDING_ORDER_MINUTE);
	rule.dayOfWeek = new schedule.Range(1, 5); //每個禮拜一到五

	schedule.scheduleJob(rule, async function (fireDate) {
		console.log("----------------------------------------");
		console.log(`盤中定時交易開始處理時間: ${fireDate.toLocaleString()}`);
		await runEveryPendingTxn(moment.toDate());
		console.log("----------------------------------------");
	});
};

// * 計算股票總價值排程1(每日15:10)
export const start_stockValue_schedule1 = () => {
	var rule = new schedule.RecurrenceRule();
	rule.hour = CALCULATE_STOCK_VALUE_HOUR_1;
	rule.minute = CALCULATE_STOCK_VALUE_MINUTE_1;
	rule.dayOfWeek = new schedule.Range(1, 5); //每個禮拜一到五

	schedule.scheduleJob(rule, async function (fireDate) {
		console.log("----------------------------------------");
		console.log(`股票總價值開始計算時間: ${fireDate.toLocaleString()}`);
		await runEveryUserStock();
		console.log("----------------------------------------");
	});
};

// * 計算股票總價值排程2(每日8:30)
export const start_stockValue_schedule2 = () => {
	var rule = new schedule.RecurrenceRule();
	rule.hour = CALCULATE_STOCK_VALUE_HOUR_2;
	rule.minute = CALCULATE_STOCK_VALUE_MINUTE_2;
	rule.dayOfWeek = new schedule.Range(1, 5); //每個禮拜一到五

	schedule.scheduleJob(rule, async function (fireDate) {
		console.log("----------------------------------------");
		console.log(`股票總價值開始計算時間: ${fireDate.toLocaleString()}`);
		await runEveryUserStock();
		console.log("----------------------------------------");
	});
};

// * 取得收盤資料排程(每日14:30)
export const start_get_closingStock_schedule = () => {
	var rule = new schedule.RecurrenceRule();
	rule.hour = GET_CLOSING_STOCK_HOUR;
	rule.minute = GET_CLOSING_STOCK_MINUTE;
	rule.dayOfWeek = new schedule.Range(1, 5); //每個禮拜一到五

	schedule.scheduleJob(rule, async function (fireDate) {
		console.log("----------------------------------------");
		console.log(`收盤資料抓取時間: ${fireDate.toLocaleString()}`);
		let today_str = moment().format("YYYY-MM-DD");
		let today = moment(today_str).toDate();
		await getStock(today);
	});
};

// * 進入收盤狀態排程(每日13:30)
export const start_closing_schedule = () => {
	var rule = new schedule.RecurrenceRule();
	rule.hour = CLOSING_HOUR;
	rule.minute = CLOSING_MINUTE;
	rule.dayOfWeek = new schedule.Range(1, 5); //每個禮拜一到五

	schedule.scheduleJob(rule, async function (fireDate) {
		console.log("----------------------------------------");
		console.log(`進入收盤時間: ${fireDate.toLocaleString()}`);
		await Global.findOneAndUpdate({ tag: "hongwei" }, { stock_closing: true }).exec();
		console.log("----------------------------------------");
	});
};

// * 進入開盤狀態排程(每日9:00)
export const start_opening_schedule = () => {
	var rule = new schedule.RecurrenceRule();
	rule.hour = OPENING_HOUR;
	rule.minute = OPENING_MINUTE;
	rule.dayOfWeek = new schedule.Range(1, 5); //每個禮拜一到五

	schedule.scheduleJob(rule, async function (fireDate) {
		console.log("----------------------------------------");
		let global = await Global.findOne({ tag: "hongwei" }).lean().exec();
		if (global.shutDown_txn) {
			console.log(`停止交易，不會進入開盤時間: ${fireDate.toLocaleString()}`);
		} else {
			console.log(`進入開盤時間: ${fireDate.toLocaleString()}`);
			await Global.findOneAndUpdate(
				{ tag: "hongwei" },
				{ stock_closing: false, stock_updated: false }
			).exec();
		}
		console.log("----------------------------------------");
	});
};

// * 每個禮拜刪除收盤資料(每個禮拜天11:30)
export const remove_closing_stock_data = () => {
	var rule = new schedule.RecurrenceRule();
	rule.dayOfWeek = REMOVE_CLOSING_STOCK_DAY; //每個禮拜天
	rule.hour = REMOVE_CLOSING_STOCK_HOUR; //每個禮拜天11點
	rule.minute = REMOVE_CLOSING_STOCK_MINUTE; //23:30分

	schedule.scheduleJob(rule, async function (fireDate) {
		console.log("----------------------------------------");
		console.log(`刪除收盤資料: ${fireDate.toLocaleString()}`);
		remove_stock_data();
		console.log("----------------------------------------");
	});
};
