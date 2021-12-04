import mongoose from "mongoose";
import Global from "../models/global_model";
import UserTxn from "../models/user_txn_model";
import moment from "moment";
import PQueue from "p-queue";
import { CLOSING_HOUR, CLOSING_MINUTE } from "../common/time";
import { updateTxn } from "./txn";
require("dotenv").config();

export const queue = new PQueue({ concurrency: 3, interval: 1000, intervalCap: 3 }); //工作管理佇列，每1秒reset，1秒內不能同時執行超過3個程序

//獨立執行交易處理起點
const Run = () => {
	const connection = mongoose.connection;
	connection.once("open", () => {
		console.log("MongoDB database connection established successfully");
		console.log("The database is " + connection.name);
		runEveryWaitingTxn();
	});
	mongoose.set("useFindAndModify", false);
	mongoose.connect(process.env.DB_CONN_STRING, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});
};

// * 伺服器運行處理收盤後未處理交易
export const runEveryWaitingTxn = async () => {
	const globalDoc = await Global.findOne({ tag: "hongwei" }).lean().exec();

	// ! 停止所有交易
	if (globalDoc.shutDown_txn) {
		console.log(`停止交易時間，不處理任何交易`);
		return;
	}

	// * 取得要處理的交易資料(由早到晚)
	const userTxnDocs = await UserTxn.find({
		status: "waiting", //等待處理的交易
		order_type: "limit",
		order_time: { $lte: moment().set({ hour: CLOSING_HOUR, minute: CLOSING_MINUTE }).toDate() },
	})
		.sort({ order_time: "asc" })
		.exec();

	// * 處理每筆訂單
	for (let i = 0; i < userTxnDocs.length; i++) {
		console.log(`正在處理第${i + 1}筆...`);
		const { _id, type } = userTxnDocs[i];
		if (type === "buy") {
			await updateTxn(_id, "fail", 1);
		} else if (type === "sell") {
			await updateTxn(_id, "fail", 2);
		}
	}

	console.log(`所有交易處理完成`);
	console.log(`處理結束，共${userTxnDocs.length}筆`);
	console.log(`----------------------------------------`);
};

// Run();
