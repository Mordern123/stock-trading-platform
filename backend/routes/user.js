import { Router } from "express";
import User from "../models/user_model";
import Account from "../models/account_model";
import UserSession from "../models/user_session_model";
import UserClass from "../models/user_class_model";
import moment from "moment";
import crypto from "crypto";
import { check_permission } from "../common/auth";
import { handle_error } from "../common/error";
import {
	getContractInstance,
	contract_call,
	contract_send,
	string_to_bytes32,
} from "../utils/ethereum";
import contract_ABI from "../contract/StockToken.json";

const router = Router();

const new_user = async (req, res) => {
	try {
		const { student_id, email, user_name, password, class_id } = req.body;
		let isExist = await User.exists({ student_id });

		if (isExist) {
			res.json({ status: false, payload: "學號已有人使用" });
			return;
		}

		let result = await User.find({ email }).exec();
		if (result.length > 0) {
			res.json({ status: false, payload: "信箱已有人使用" });
			return;
		}

		if (class_id && !["GLOBAL_CLASS", "CLASS1", "CLASS2", "CLASS3"].includes(class_id)) {
			res.json({ status: false, payload: "未指定班級" });
			return;
		}

		//建立使用者
		const newUser = await new User({
			student_id,
			email,
			user_name,
			password,
		}).save();

		// 建立使用者所屬課堂
		await new UserClass({
			user: newUser.id,
			class_id: class_id,
		}).save();

		// 建立新戶
		await new Account({
			user: newUser.id,
			class_id: class_id,
			balance: 2000000, //預設給帳戶200萬
			last_update: moment().toDate(),
			last_value_update: moment().toDate(),
		}).save();

		// 建立使用者Session
		await new UserSession({
			user: newUser.id,
		}).save();

		res.json({ status: true, payload: newUser });
	} catch (error) {
		handle_error(error, res);
	}
};

const user_login = async (req, res) => {
	try {
		const { id, hashValue } = req.body;
		let userDoc1 = await User.findOne({ email: id }).exec();
		let userDoc2 = await User.findOne({ student_id: id }).exec();
		let userDoc = userDoc1 ? userDoc1 : userDoc2 ? userDoc2 : null; //email沒有就檢查student_id
		if (userDoc) {
			//加密計算
			const session = await UserSession.findOne({ user: userDoc._id }); //取得session key
			const value = crypto
				.createHmac("sha512", session.user_key)
				.update(userDoc.password)
				.digest("hex");

			//隨機Token
			crypto.randomBytes(16, async (err, buffer) => {
				if (err) throw err;
				var token = buffer.toString("hex"); //token值
				if (value === hashValue) {
					let options = {
						maxAge: 1000 * 60 * 60 * 24 * 7, // would expire after 7 days
						// httpOnly: true, // The cookie only accessible by the web server
						signed: true, // Indicates if the cookie should be signed
					};
					let isExist = await UserSession.exists({ user: userDoc._id });
					if (isExist) {
						//更新cookie
						await UserSession.updateOne(
							{ user: userDoc._id },
							{ cookie: token }
						).exec();
					} else {
						//新增session和cookie
						await new UserSession({
							user: userDoc._id,
							cookie: token,
						}).save();
					}

					res.cookie("user_token", token, options);
					res.json({ status: true, payload: userDoc });
				} else {
					res.json({ status: false, payload: "密碼錯誤" });
				}
			});
		} else {
			res.json({ status: false, payload: "沒有此使用者" });
		}
	} catch (error) {
		handle_error(error, res);
	}
};

const get_login_key = async (req, res) => {
	try {
		const { id } = req.body;
		let userDoc1 = await User.findOne({ email: id }).exec();
		let userDoc2 = await User.findOne({ student_id: id }).exec();
		let user = userDoc1 ? userDoc1 : userDoc2 ? userDoc2 : null; //email沒有就檢查student_id

		if (user) {
			//隨機亂數Token
			crypto.randomBytes(16, async function (err, buffer) {
				if (err) throw err;
				var key = buffer.toString("hex");
				await UserSession.findOneAndUpdate({ user: user._id }, { user_key: key });
				res.json(key);
			});
		} else {
			res.json(false);
		}
	} catch (error) {
		handle_error(error, res);
	}
};

const user_logout = async (req, res) => {
	try {
		const { user_token } = req.signedCookies;
		await UserSession.updateOne({ cookie: user_token }, { cookie: "" });
		// res.cookies.set('user_token', {expires: Date.now()}) //清空cookie
		res.clearCookie("user_token");
		res.status(200).send();
	} catch (e) {
		throw e;
	}
};

const get_user_data = async (req, res) => {
	const { user, code } = await check_permission(req);

	if (!user) {
		// res.cookies.set('user_token', {expires: Date.now()}) //清空cookie
		res.clearCookie("user_token");
		res.status(code).send();
		return;
	}

	const userDoc = await User.findById(user._id).lean().exec();
	if (userDoc) {
		const newDoc = userDoc;
		newDoc.updatedAt = moment(userDoc.updatedAt).startOf("hour").fromNow();
		newDoc.createdAt = moment(userDoc.createdAt).calendar(null, { lastWeek: "dddd HH:mm" }); //星期三 10:55
		res.json(newDoc);
	} else {
		res.json(false);
	}
};

const update_user_data = async (req, res) => {
	const { user, code } = await check_permission(req);

	if (!user) {
		res.clearCookie("user_token");
		res.status(code).send();
		return;
	}

	const { user_name, sex, birthday } = req.body;
	const userDoc = await User.findByIdAndUpdate(
		user._id,
		{
			user_name,
			sex,
			birthday,
		},
		{
			new: true,
		}
	).exec();

	if (userDoc) {
		res.json(true);
	} else {
		res.json(false);
	}
};

const get_user_account = async (req, res) => {
	const { user, code } = await check_permission(req);

	if (!user) {
		res.clearCookie("user_token");
		res.status(code).send();
		return;
	}

	const accountDoc = await Account.findOne({ user: user._id }).lean().exec();
	const { updatedAt, createdAt, last_update, last_value_update } = accountDoc;
	if (accountDoc) {
		const newDoc = accountDoc;
		newDoc.updatedAt = moment(updatedAt).startOf("hour").fromNow();
		newDoc.createdAt = moment(createdAt).calendar(null, { lastWeek: "dddd HH:mm" }); //星期x xx:xx
		newDoc.last_update = moment(last_update).calendar(null, { lastWeek: "dddd HH:mm" }); //星期x xx:xx
		newDoc.last_value_update = moment(last_value_update).calendar(null, {
			lastWeek: "dddd HH:mm",
		}); //星期x xx:xx
		res.json(newDoc);
	} else {
		res.json(false);
	}
};

const get_user_token = async (req, res) => {
	const { user, code } = await check_permission(req);

	if (!user) {
		res.clearCookie("user_token");
		res.status(code).send();
		return;
	}

	try {
		const uid_bytes32 = string_to_bytes32(user.student_id);
		const contract = await getContractInstance(contract_ABI, process.env.CONTRACT_ADDRESS);
		const result = await contract_call(contract, "get_token", [uid_bytes32]);
		res.json(result);
	} catch (error) {
		res.json(false);
	}
};

router.route("/new").post(new_user);
router.route("/login").post(user_login);
router.route("/logout").post(user_logout);
router.route("/loginKey").post(get_login_key);
router.route("/get").post(get_user_data);
router.route("/update").post(update_user_data);
router.route("/account").post(get_user_account);
router.route("/token").get(get_user_token);
// router.route("/token").post(get_user_token);

export default router;
