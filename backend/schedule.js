import schedule from "node-schedule";
import { runEveryTxn, runEveryUserStock } from "./txn";
import { remove_stock_data } from "./common/utils";
import { getStock } from "./getStock";
import moment from "moment";
import Global from "./models/global_model";

// * 收盤處理股票交易排程(每60分鐘)
export const start_txn_schedule = () => {
	var rule = new schedule.RecurrenceRule();
	rule.minute = new schedule.Range(0, 59, 60); //每60分鐘一次
	rule.hour = [new schedule.Range(15, 23), new schedule.Range(0, 7)]; //15點到隔天早上7點
	rule.dayOfWeek = new schedule.Range(1, 5); //每個禮拜一到五

	schedule.scheduleJob(rule, async function (fireDate) {
		console.log("----------------------------------------");
		console.log(`交易開始處理時間: ${fireDate.toLocaleString()}`);
		await runEveryTxn();
		console.log("----------------------------------------");
	});
};

// * 計算股票總價值排程1(每日15:05)
export const start_stockValue_schedule1 = () => {
	var rule = new schedule.RecurrenceRule();
	rule.hour = 15;
	rule.minute = 5;
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
	rule.hour = 8;
	rule.minute = 30;
	rule.dayOfWeek = new schedule.Range(1, 5); //每個禮拜一到五

	schedule.scheduleJob(rule, async function (fireDate) {
		console.log("----------------------------------------");
		console.log(`股票總價值開始計算時間: ${fireDate.toLocaleString()}`);
		await runEveryUserStock();
		console.log("----------------------------------------");
	});
};

// * 取得收盤資料排程(每日14:25)
export const start_get_closingStock_schedule = () => {
	var rule = new schedule.RecurrenceRule();
	rule.hour = 14;
	rule.minute = 25;
	rule.dayOfWeek = new schedule.Range(1, 5); //每個禮拜一到五

	schedule.scheduleJob(rule, async function (fireDate) {
		console.log("----------------------------------------");
		console.log(`收盤資料抓取時間: ${fireDate.toLocaleString()}`);
		let today_str = moment().format("YYYY-MM-DD");
		let today = moment(today_str).toDate();
		await getStock(today);
		console.log("----------------------------------------");
	});
};

// * 進入收盤狀態排程(每日14:28)
export const start_closing_schedule = () => {
	var rule = new schedule.RecurrenceRule();
	rule.hour = 14;
	rule.minute = 28;
	rule.dayOfWeek = new schedule.Range(1, 5); //每個禮拜一到五

	schedule.scheduleJob(rule, function (fireDate) {
		const change = async () => {
			await Global.findOneAndUpdate({ tag: "hongwei" }, { stock_closing: true }).exec();
		};
		console.log("----------------------------------------");
		console.log(`進入收盤時間: ${fireDate.toLocaleString()}`);
		console.log("----------------------------------------");
		change();
	});
};

// * 進入開盤狀態排程(每日9:00)
export const start_opening_schedule = () => {
	var rule = new schedule.RecurrenceRule();
	rule.hour = 9;
	rule.minute = 0;
	rule.dayOfWeek = new schedule.Range(1, 5); //每個禮拜一到五

	schedule.scheduleJob(rule, function (fireDate) {
		const change = async () => {
			await Global.findOneAndUpdate({ tag: "hongwei" }, { stock_closing: false }).exec();
		};
		console.log("----------------------------------------");
		console.log(`進入開盤時間: ${fireDate.toLocaleString()}`);
		console.log("----------------------------------------");
		change();
	});
};

// * 每個禮拜刪除收盤資料(每個禮拜天11點)
export const remove_closing_stock_data = () => {
	var rule = new schedule.RecurrenceRule();
	rule.minute = 30; //23:30分
	rule.hour = 23; //每個禮拜天11點
	rule.dayOfWeek = 0; //每個禮拜天

	schedule.scheduleJob(rule, function (fireDate) {
		const remove = async () => {
			await remove_stock_data();
		};
		console.log("----------------------------------------");
		console.log(`刪除收盤資料: ${fireDate.toLocaleString()}`);
		console.log("----------------------------------------");
		remove();
	});
};
