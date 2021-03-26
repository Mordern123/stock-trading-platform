import express from "express";
import cors from "cors";
import schedule from "node-schedule";
import mongoose from "mongoose";
import { Server } from "http";
import logger from "morgan";
import PQueue from "p-queue";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user";
import classRouter from "./routes/class";
import stockRouter from "./routes/stock";
import txnRouter from "./routes/transaction";
import Global from "./models/global_model";
import {
	start_pending_txn_schedule,
	start_get_closingStock_schedule,
	start_closing_schedule,
	start_opening_schedule,
	start_stockValue_schedule1,
	start_stockValue_schedule2,
	remove_closing_stock_data,
} from "./utils/schedule";
import socket from "socket.io";
import moment from "moment";

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const server = Server(app);
const io = socket().listen(server);
const connection = mongoose.connection;
export const queue = new PQueue({ concurrency: 3, interval: 1000, intervalCap: 3 }); //工作管理佇列，每1秒reset，1秒內不能同時執行超過3個程序

connection.once("open", () => {
	console.log("MongoDB database connection established successfully");
	console.log("The database is " + connection.name);

	// * 啟動排程
	start_pending_txn_schedule();
	start_get_closingStock_schedule();
	start_closing_schedule();
	start_opening_schedule();
	start_stockValue_schedule1();
	start_stockValue_schedule2();
	remove_closing_stock_data();
});
mongoose.connect(process.env.DB_CONN_STRING, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);

//允許cors要求網址
var allowedOrigins = [
	"http://localhost:3000",
	"http://127.0.0.1:3000",
	"http://localhost:8080",
	"http://127.0.0.1:8080",
	"http://192.168.0.6:8080",
	"http://35.229.149.140:80",
];
app.use(
	cors({
		origin: (origin, callback) => {
			return callback(null, true);
		},
		credentials: true,
	})
);

app.use(cookieParser("hongwei0417")); //cookie簽章
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use("/user", userRouter);
app.use("/class", classRouter);
app.use("/stock", stockRouter);
app.use("/txn", txnRouter);

//取得全域參數
app.get("/global", async (req, res) => {
	const doc = await Global.findOne({ tag: "hongwei" }).exec();
	res.json(doc);
});

//取得列隊等待工作
app.get("/job", async (req, res) => {
	const list = schedule.scheduledJobs;
	res.json(list);
});

global.online_count = 0; //上線平台總人數
io.on("connection", (socket) => {
	const online_add = async () => {
		online_count += 1;
		io.emit("online", online_count);
		console.log("一位使用者上線，總人數: " + online_count);
	};
	online_add();
	socket.on("disconnect", async () => {
		online_count -= 1;
		io.emit("online", online_count);
		console.log("一位使用者下線，總人數: " + online_count);
	});
});

server.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
