import { Router } from "express";
import schedule from "node-schedule";
import Stock from "../models/stock_model";
import UserStock from "../models/user_stock_model";
import UserTrack from "../models/user_track_model";
import UserTxn from "../models/user_txn_model";
import UserSearch from "../models/user_search_model";
import UserClass from "../models/user_class_model";
import Account from "../models/account_model";
import Global from "../models/global_model";
import moment from "moment";
import { check_permission } from "../common/auth";
import { queue } from "../server";
import { task, txn_task } from "../common/scraper";
import { add_user_search } from "../common/utils";
import { handle_error } from "../common/error";
import { closing_data_to_stock_info } from "../common/tools";

moment.locale("zh-tw");

const router = Router();

//取得收盤資料
const get_all_stock = async (req, res) => {
	try {
		const { user, code } = await check_permission(req);
		if (!user) {
			res.clearCookie("user_token");
			res.status(code).send();
			return;
		}

		//取得收盤股票時間
		let global = await Global.findOne({ tag: "hongwei" }).exec();
		let date = moment(global.stock_update_time).toDate();
		let result = await Stock.find({ data_time: date }).exec();
		res.json(result);
	} catch (error) {
		handle_error(error, res);
	}
};

//取得收盤更新時間
const get_stock_updateTime = async (req, res) => {
	try {
		const { user, code } = await check_permission(req);
		if (!user) {
			res.clearCookie("user_token");
			res.status(code).send();
			return;
		}

		//取得收盤股票時間
		let global = await Global.findOne({ tag: "hongwei" }).exec();
		res.json(global.stock_update_time);
	} catch (error) {
		handle_error(error, res);
	}
};

//取得全部股票排名
const get_stock_rank = async (req, res) => {
	const { user, code } = await check_permission(req);

	if (!user) {
		res.clearCookie("user_token");
		res.status(code).send();
		return;
	}

	const doc = await UserClass.findOne({ user: user._id }).exec();

	// 沒有userClass實體就取得所有班級排名
	if (doc) {
		let accountDocs = await Account.find({ class_id: doc.class_id })
			.sort({ total_amount: "desc" })
			.populate("user")
			// .limit(50)
			.lean()
			.exec();
		let rank_data = accountDocs.map((item) => {
			return {
				student_id: item.user.student_id,
				total_amount: item.total_amount || 0,
				stock_number: item.stock_number,
				txn_count: item.txn_count,
			};
		});
		const updateTime = moment().calendar(null, { lastWeek: "dddd HH:mm" }); //ex: 星期三 10:55

		res.json({
			rank_data,
			updateTime,
		});
	} else {
		let accountDocs = await Account.find()
			.sort({ total_amount: "desc" })
			.populate("user")
			.limit(50)
			.lean()
			.exec();
		let rank_data = accountDocs.map((item) => {
			return {
				student_id: item.user.student_id,
				total_amount: item.total_amount || 0,
				stock_number: item.stock_number,
				txn_count: item.txn_count,
			};
		});
		const updateTime = moment().calendar(null, { lastWeek: "dddd HH:mm" }); //ex: 星期三 10:55

		res.json({
			rank_data,
			updateTime,
		});
	}
};

//取得用戶擁有股票
const get_user_stock = async (req, res) => {
	const { user, code } = await check_permission(req);

	if (!user) {
		res.clearCookie("user_token");
		res.status(code).send();
		return;
	}

	const userStockDoc = await UserStock.find({ user: user._id }).populate(["stock"]).lean().exec();
	const userStockData = userStockDoc.map((item) => {
		let newDoc = item;
		newDoc.last_update = moment(item.last_update).startOf("hour").fromNow();
		newDoc.updatedAt = moment(item.updatedAt).startOf("hour").fromNow();
		newDoc.createdAt = moment(item.createdAt).calendar(null, { lastWeek: "dddd HH:mm" }); //星期三 10:55
		return newDoc;
	});
	res.json(userStockData);
};

// * 用戶下訂單
const user_place_order = async (req, res) => {
	try {
		let { user, code } = await check_permission(req);
		let { stock_id, stockInfo, shares_number, bid_price } = req.body; //前端傳送值

		if (!user) {
			res.clearCookie("user_token");
			res.status(code).send();
			return;
		}

		// ! 判斷必須條件
		if (!["buy", "sell"].includes(req.params.type)) throw false; //檢查交易類型
		if (!["market", "limit"].includes(req.query.order_type)) throw false; //檢查委託單類型
		if (req.query.order_type === "limit" && !bid_price && bid_price <= 0) throw false; //檢查限價交易資料

		// ? 變數
		let doc = await UserClass.findOne({ user: user._id }).exec();
		let global = await Global.findOne({ tag: "hongwei" }).lean().exec();
		let current_time = moment().toDate(); //下單時間
		let closing =
			req.query.order_type === "limit" || global.shutDown_txn ? true : global.stock_closing; // ? 限價一律收盤後處理

		// * 新增一筆訂單
		const _userTxnDoc = await new UserTxn({
			class_id: doc ? doc.class_id : "GLOBAL_CLASS", //沒有class_id代表是global
			user: user._id,
			stock_id,
			shares_number,
			stockInfo,
			type: req.params.type,
			order_type: req.query.order_type,
			order_time: current_time,
			bid_price: bid_price || 0,
			closing,
		}).save();
		const userTxnDoc = _userTxnDoc.toObject();

		// ! 只有開盤時間交易需要排程
		if (!closing) {
			let txn_time = moment().add(40, "m").toDate(); //處理交易時間
			console.log("一筆訂單將在: " + txn_time.toLocaleString() + " 處理");
			let j = schedule.scheduleJob(txn_time, async () => {
				// ! 檢查訂單是否還存在
				let txn_exist = await UserTxn.exists({ _id: userTxnDoc._id });
				if (txn_exist) {
					queue.add(() => txn_task(userTxnDoc));
				}
			}); //加入執行佇列
		}

		res.json(userTxnDoc);
	} catch (error) {
		handle_error(error, res);
	}
};

//取得使用者追蹤股票資訊
const get_user_track = async (req, res) => {
	try {
		const { user, code } = await check_permission(req);

		if (!user) {
			res.clearCookie("user_token");
			res.status(code).send();
			return;
		}

		const userTrackDoc = await UserTrack.find({ user: user._id }).lean().exec();
		for (let i = 0; i < userTrackDoc.length; i++) {
			let { stock_id, track_time, createdAt, updatedAt } = userTrackDoc[i];
			let stockDoc = await Stock.findOne({ stock_id }).sort("-data_time").exec(); //取的目前最新股票
			userTrackDoc[i].stock = stockDoc;
			(userTrackDoc[i].track_time = moment(track_time).calendar(null, {
				lastWeek: "dddd HH:mm",
			})), //星期三 10:55
				(userTrackDoc[i].createdAt = moment(createdAt).startOf("hour").fromNow());
			userTrackDoc[i].updatedAt = moment(updatedAt).startOf("hour").fromNow();
		}

		res.json(userTrackDoc);
	} catch (error) {
		handle_error(error, res);
	}
};

//用戶追蹤股票
const user_track_stock = async (req, res) => {
	try {
		const { user, code } = await check_permission(req);

		if (!user) {
			res.status(code).send();
			return;
		}

		const { stock_id } = req.body;
		const hasStock = await UserTrack.exists({ user: user._id, stock_id });
		const track_time = Date(Date.now());
		let userTrackDoc;

		if (hasStock) {
			userTrackDoc = await UserTrack.findOneAndDelete({ user: user._id, stock_id }).exec();
		} else {
			userTrackDoc = await new UserTrack({
				user: user._id,
				stock_id,
				track_time,
			}).save();
		}
		res.json(userTrackDoc);
	} catch (error) {
		handle_error(error, res);
	}
};

// * 取得即時股票資訊
const get_realTime_stock = async (req, res) => {
	const { user, code } = await check_permission(req);
	if (!user) {
		res.status(code).send();
		return;
	}

	let stock_id = req.params.stock_id;
	let stockData = await Stock.findOne({ stock_id }).lean().exec(); //檢查股票是否存在

	if (stockData) {
		let global = await Global.findOne({ tag: "hongwei" }).exec();

		// ! 檢查是否收盤後+已取得收盤資料
		if (global.stock_closing && global.stock_updated) {
			// * 收盤期間取收盤資料
			try {
				// let today_str = moment().format("YYYY-MM-DD"); //今日最小單位
				// let today = moment(today_str).toDate();
				// let stock = await Stock.findOne({ stock_id, data_time: today }).exec(); //找尋今日收盤資訊
				let closing_data = await Stock.findOne({ stock_id }).sort("-data_time").exec(); //取的目前最新收盤資料
				let stock_info = closing_data_to_stock_info(closing_data);

				await add_user_search(user, stock_info); //儲存搜尋紀錄
				res.json(stock_info);
			} catch (error) {
				handle_error(error, res);
			}
		} else {
			// * 爬蟲取得最新資料
			await queue.add(() => task(user, stockData.stock_id, stockData.stock_name, res)); //加入執行佇列
		}
	} else {
		res.status(204).send(); //找不到股票
	}
};

//取得使用者搜尋紀錄
const get_user_search = async (req, res) => {
	const { user, code } = await check_permission(req);
	if (!user) {
		res.status(code).send();
		return;
	}
	let docs = await UserSearch.find({ user: user._id })
		.sort({ request_time: "desc" })
		.lean()
		.exec();
	let result = docs.map((item) => {
		return {
			...item,
			request_time: moment(item.request_time).calendar(null, { lastWeek: "這dddd HH:mm" }), //星期三 10:55,
			createdAt: moment(item.createdAt).startOf("hour").fromNow(),
			updatedAt: moment(item.updatedAt).startOf("hour").fromNow(),
		};
	});
	res.json(result);
};

router.route("/get/all").get(get_all_stock);
router.route("/get/updateTime").get(get_stock_updateTime);
router.route("/get/:stock_id").get(get_realTime_stock);
router.route("/get/rank").post(get_stock_rank);
router.route("/user/get").post(get_user_stock);
router.route("/user/order/:type").post(user_place_order);
router.route("/user/track").post(user_track_stock);
router.route("/user/track/get").post(get_user_track);
router.route("/user/search").get(get_user_search);

export default router;
