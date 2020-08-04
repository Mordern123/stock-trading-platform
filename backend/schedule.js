import schedule from "node-schedule";
import { runEveryTxn, runEveryUserStock } from "./txn";
import { getStock } from "./getStock";
import moment from "moment";
import Global from "./models/global_model";

//處理股票交易排程(每30分鐘)
export const start_txn_schedule = () => {
	var rule = new schedule.RecurrenceRule();
	rule.minute = new schedule.Range(0, 59, 30); //每10分鐘一次
	rule.hour = new schedule.Range(9, 14); //每天9點到14點
	rule.dayOfWeek = new schedule.Range(1, 5); //每個禮拜一到五

	schedule.scheduleJob(rule, function (fireDate) {
		console.log(`交易開始處理時間: ${fireDate}`);
		runEveryTxn();
	});
};

//計算股票總價值排程1(每日15:05)
export const start_stockValue_schedule1 = () => {
	var rule = new schedule.RecurrenceRule();
	rule.hour = 15;
	rule.minute = 5;

	schedule.scheduleJob(rule, function (fireDate) {
		console.log(`股票總價值開始計算時間: ${fireDate}`);
		runEveryUserStock();
	});
};

//計算股票總價值排程2(每日8:30)
export const start_stockValue_schedule2 = () => {
	var rule = new schedule.RecurrenceRule();
	rule.hour = 8;
	rule.minute = 30;

	schedule.scheduleJob(rule, function (fireDate) {
		console.log(`股票總價值開始計算時間: ${fireDate}`);
		runEveryUserStock();
	});
};

//取得收盤資料排程(每日14:35)
export const start_get_closingStock_schedule = () => {
	var rule = new schedule.RecurrenceRule();
	rule.hour = 14;
	rule.minute = 35;
	rule.dayOfWeek = new schedule.Range(1, 5); //每個禮拜一到五

	schedule.scheduleJob(rule, function (fireDate) {
		console.log(`收盤資料抓取時間: ${fireDate}`);
		let today_str = moment().format("YYYY-MM-DD");
		let today = moment(today_str).toDate();
		getStock(today);
	});
};

//進入收盤狀態排程(每日14:38)
export const start_closing_schedule = () => {
	var rule = new schedule.RecurrenceRule();
	rule.hour = 14;
	rule.minute = 38;
	rule.dayOfWeek = new schedule.Range(1, 5); //每個禮拜一到五

	schedule.scheduleJob(rule, function (fireDate) {
		const change = async () => {
			await Global.findOneAndUpdate({ tag: "hongwei" }, { stock_closing: true }).exec();
		};
		console.log(`進入收盤時間: ${fireDate}`);
		change();
	});
};

//進入開盤狀態排程(每日9:00)
export const start_opening_schedule = () => {
	var rule = new schedule.RecurrenceRule();
	rule.hour = 9;
	rule.minute = 0;
	rule.dayOfWeek = new schedule.Range(1, 5); //每個禮拜一到五

	schedule.scheduleJob(rule, function (fireDate) {
		const change = async () => {
			await Global.findOneAndUpdate({ tag: "hongwei" }, { stock_closing: false }).exec();
		};
		console.log(`進入開盤時間: ${fireDate}`);
		change();
	});
};
