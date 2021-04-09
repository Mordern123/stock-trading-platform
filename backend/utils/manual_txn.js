import mongoose from "mongoose";
import UserTxn from "../models/user_txn_model";
import moment from "moment";
import PQueue from "p-queue";
import { txn_task } from "../common/scraper";
require("dotenv").config();

export const queue = new PQueue({ concurrency: 3, interval: 1000, intervalCap: 3 }); //工作管理佇列，每1秒reset，1秒內不能同時執行超過3個程序

//獨立執行交易處理起點
const Run = () => {
	const connection = mongoose.connection;
	connection.once("open", () => {
		console.log("MongoDB database connection established successfully");
		console.log("The database is " + connection.name);
		runEveryTxn();
	});
	mongoose.set("useFindAndModify", false);
	mongoose.connect(process.env.DB_CONN_STRING, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});
};

// * 伺服器運行處理交易執行起點
export const runEveryTxn = async () => {
	const globalDoc = await Global.findOne({ tag: "hongwei" }).lean().exec();

	// ! 停止所有交易
	if (globalDoc.shutDown_txn) {
		console.log(`停止交易時間，不處理任何交易`);
		return;
	}

	// * 取得要處理的交易資料(由早到晚)
	const userTxnDocs = await UserTxn.find({
		status: "waiting", //等待處理的交易
		order_time: { $lte: moment().toDate() },
	})
		.sort({ order_time: "asc" })
		.exec();

	// * 處理每筆訂單
	for (let i = 0; i < userTxnDocs.length; i++) {
		console.log(`正在處理第${i + 1}筆...`);
		queue.add(() => txn_task(userTxnDocs[i])); //* 加入執行佇列
	}

	console.log(`所有交易處理完成`);
	console.log(`處理結束，共${userTxnDocs.length}筆`);
};

Run();
