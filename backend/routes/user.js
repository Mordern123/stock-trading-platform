import { Router } from "express";
import User from "../models/user_model";
import Account from "../models/account_model";
import UserSession from "../models/user_session_model";
import moment from "moment";
import crypto from "crypto";
import { check_permission } from "../common/auth";
import { handle_error } from "../common/error";

const router = Router();

const new_user = async (req, res) => {
	try {
		const userData = req.body;
		let isExist = await User.exists({ student_id: userData.student_id });

		if (isExist) {
			res.json({ status: false, payload: "學號已有人使用" });
			return;
		}

		let result = await User.find({ email: userData.email }).exec();
		if (result.length > 0) {
			res.json({ status: false, payload: "信箱已有人使用" });
			return;
		}

		//建立相關文件
		const newUser = await new User(req.body).save();

		await new Account({
			user: newUser.id,
			balance: 1000000,
			last_update: moment(),
		}).save();

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
		const { student_id, hashValue } = req.body;
		let userDoc = await User.findOne({ student_id: student_id }).exec();
		if (userDoc) {
			//加密計算
			const session = await UserSession.findOne({ user: userDoc._id }); //取得session key
			console.log(session);
			const value = crypto.createHmac("sha512", session.user_key).update(userDoc.password).digest("hex");

			//隨機Token
			crypto.randomBytes(16, async (err, buffer) => {
				if (err) throw err;
				var token = buffer.toString("hex"); //token值
				console.log(value === hashValue);
				if (value === hashValue) {
					let options = {
						maxAge: 1000 * 60 * 60 * 24 * 7, // would expire after 7 days
						// httpOnly: true, // The cookie only accessible by the web server
						signed: true, // Indicates if the cookie should be signed
					};
					let isExist = await UserSession.exists({ user: userDoc._id });
					if (isExist) {
						//更新cookie
						await UserSession.updateOne({ user: userDoc._id }, { cookie: token }).exec();
					} else {
						//新增session和cookie
						await new UserSession({
							user: userDoc._id,
							cookie: token,
						}).save();
					}

					console.log(123);
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
		const { student_id } = req.body;
		let user = await User.findOne({ student_id: student_id });

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

	const { user_name, sex, birthday, email } = req.body;
	const userDoc = await User.findByIdAndUpdate(
		user._id,
		{
			user_name,
			sex,
			birthday,
			email,
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
		newDoc.last_value_update = moment(last_value_update).calendar(null, { lastWeek: "dddd HH:mm" }); //星期x xx:xx
		res.json(newDoc);
	} else {
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

export default router;
