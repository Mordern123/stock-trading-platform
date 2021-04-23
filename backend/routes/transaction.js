import { application, Router } from "express";
import Stock from "../models/stock_model";
import UserStock from "../models/user_stock_model";
import UserTrack from "../models/user_track_model";
import UserTxn from "../models/user_txn_model";
import Global from "../models/global_model";
import UserClass from "../models/user_class_model";
import User from "../models/user_model";
import moment from "moment";
import { check_permission } from "../common/auth";

moment.locale("zh-tw");

const router = Router();

const get_all_txn = async (req, res) => {
	const { user, code } = await check_permission(req);
	const { day } = req.query;

	if (!user) {
		res.clearCookie("user_token");
		res.status(code).send();
		return;
	}

	const doc = await UserClass.findOne({ user: user._id }).exec();

	if (doc) {
		if (day) {
			let s = moment().subtract(parseInt(day), "days").format("YYYYMMDD"); //起始時間
			let e = moment().add(1, "days").format("YYYYMMDD"); //結束時間取明天
			let txnDoc = await UserTxn.find({
				class_id: doc.class_id,
				order_time: {
					$gte: moment(s),
					$lt: moment(e),
				},
			}).exec();

			res.json(txnDoc);
		} else {
			const txnDoc = await UserTxn.find({ class_id: doc.class_id }).exec();
			res.json(txnDoc);
		}
	} else {
		if (day) {
			let s = moment().subtract(parseInt(day), "days").format("YYYYMMDD"); //起始時間
			let e = moment().add(1, "days").format("YYYYMMDD"); //結束時間取明天
			let txnDoc = await UserTxn.find({
				order_time: {
					$gte: moment(s),
					$lt: moment(e),
				},
			}).exec();

			res.json(txnDoc);
		} else {
			const txnDoc = await UserTxn.find().exec();
			res.json(txnDoc);
		}
	}
};

const get_user_txn = async (req, res) => {
	const { type } = req.params;
	const { pure, day } = req.query;
	const { user, code } = await check_permission(req);

	if (!user) {
		res.clearCookie("user_token");
		res.status(code).send();
		return;
	}

	if (!["all", "success", "fail", "waiting", "error"].includes(type)) {
		res.json(false);
		return;
	}

	const conditions = type === "all" ? { user: user._id } : { user: user._id, status: type };

	//處理取得資料天數
	if (day) {
		let s = moment().subtract(parseInt(day), "days").format("YYYYMMDD"); //起始時間
		let e = moment().add(1, "days").format("YYYYMMDD"); //結束時間取明天
		conditions.order_time = {
			$gte: moment(s),
			$lt: moment(e),
		};
	}

	const txnData = await UserTxn.find(conditions)
		.sort({
			createdAt: -1,
		})
		.lean()
		.exec();

	if (txnData) {
		if (pure) {
			//純資料
			res.json(txnData);
		} else {
			const newTxnData = txnData.map((item) => {
				let newDoc = item;
				if (item.type == "buy") {
					newDoc.type = "買入";
				} else if ((item.type = "sell")) {
					newDoc.type = "賣出";
				}
				newDoc.updatedAt = moment(item.updatedAt).startOf("hour").fromNow();
				newDoc.createdAt = moment(item.createdAt).calendar(null, {
					lastWeek: "dddd HH:mm",
				}); //星期三 10:55
				newDoc.order_time = moment(item.order_time).calendar(null, {
					lastWeek: "dddd HH:mm",
				});
				newDoc.txn_time =
					item.txn_time != null
						? moment(item.txn_time).calendar(null, { lastWeek: "dddd HH:mm" })
						: "尚未處理交易";
				return newDoc;
			});
			res.json(newTxnData);
		}
	} else {
		res.json(false);
	}
};
	
const delete_user_txn = async (req, res) => {
	const { id } = req.query;
	const { user, code } = await check_permission(req);
	const currentDateTime = moment().format('YYYY/MM/DD HH:mm:ss');
	const closingFalseTime = moment().set({'hours': 8, 'minute': 59});
	const closingTrueTime = moment().set({'hours': 13, 'minute': 30});

	if (!user) {
		res.clearCookie("user_token");
		res.status(code).send();
		return;
	}
	
	if (id) {
		const txnDoc = await UserTxn.findById(id).exec();
		const globalDoc = await Global.findOne({ tag: "hongwei" }).exec();
		console.log(txnDoc.order_time);
		if(txnDoc.order_type === "market" ){
			if(!txnDoc.closing){
				const order_timeUpdate = moment(txnDoc.order_time).add(10, 'm');
				if(moment(currentDateTime).isBefore(order_timeUpdate)){
					const doc = await UserTxn.findByIdAndDelete(id).exec();
					res.json(true);
				}
				else{
					res.json(false);
				}
			}
			else{
				//如果在開盤且3~10之間 就不能取消訂單
				if(!globalDoc.stock_closing && moment(currentDateTime).isBetween(closingFalseTime,closingTrueTime)){
					res.json(false);
				}
				else{
					const doc = await UserTxn.findByIdAndDelete(id).exec();
					res.json(true);
				}
			}
		}
		else{
			const doc = await UserTxn.findByIdAndDelete(id).exec();
			res.json(true);
		}
	} else { 
		res.status(404).send();
	}
};

const get_class_txn_avg = async (req, res) => {
	const { user, code } = await check_permission(req);

	if (!user) {
		res.clearCookie("user_token");
		res.status(code).send();
		return;
	}

	const { day } = req.body;
	const dayString = moment().format("YYYY-MM-DD"); //轉換為最小單位為天
	const startDay = moment(dayString).subtract(day, "days"); //取得instance
	const countObj = {};
	const avgObj = {};

	const doc = await UserClass.findOne({ user: user._id }).exec();

	// 沒有userClass實體就取得所有user交易狀況
	if (doc) {
		const userCount = await UserClass.countDocuments({ class_id: doc.class_id });

		const txnDoc = await UserTxn.find({
			class_id: doc.class_id,
			order_time: {
				$gte: startDay.toDate(),
			},
		})
			.sort({
				order_time: 1,
			})
			.exec();

		if (txnDoc) {
			txnDoc.forEach((txn) => {
				let ds = moment(txn.order_time).format("YYYY-MM-DD");
				let txnCount = countObj[ds] || 0;
				countObj[ds] = txnCount + 1; //計算交易次數
			});

			//計算平均每位學生的交易次數
			for (let key in countObj) {
				avgObj[key] = Math.round((countObj[key] / userCount) * 10) / 10;
			}
		}
	} else {
		const userCount = await User.countDocuments();

		const txnDoc = await UserTxn.find({
			order_time: {
				$gte: startDay.toDate(),
			},
		})
			.sort({
				order_time: 1,
			})
			.exec();

		if (txnDoc) {
			txnDoc.forEach((txn) => {
				let ds = moment(txn.order_time).format("YYYY-MM-DD");
				let txnCount = countObj[ds] || 0;
				countObj[ds] = txnCount + 1; //計算交易次數
			});

			//計算平均每位學生的交易次數
			for (let key in countObj) {
				avgObj[key] = Math.round((countObj[key] / userCount) * 10) / 10;
			}
		}
	}

	res.json(avgObj);
};

router.route("/get/all").get(get_all_txn);
router.route("/get/user/:type").get(get_user_txn);
router.route("/get/class/avg").get(get_class_txn_avg);
//暫時移除取消訂單功能
router.route("/user").delete(delete_user_txn);

export default router;
