import { Router } from "express";
import Announcement from "../models/announce_model";
import UserSession from "../models/user_session_model";
import Post from "../models/post_model";
import { check_permission } from "../common/auth";
import { handle_error } from "../common/error";

const router = Router();

const add_Announcement = async (req, res) => {
	try {
		const { user, code } = await check_permission(req);

		if (!user) {
			res.clearCookie("user_token");
			res.status(code).send();
			return;
		}

		const result = await Announcement.create(req.body);
		res.json(result);
	} catch (error) {
		res.json("新增失敗!");
	}
};

const get_Announcement = async (req, res) => {
	const { user, code } = await check_permission(req);

	if (!user) {
		res.clearCookie("user_token");
		res.status(code).send();
		return;
	}

	const result = await Announcement.find()
		.populate("publisher", "user_name")
		.sort({ publish_date: "desc" })
		.exec();
	res.json(result);
};

//取得文章
const get_post = async (req, res) => {
	const { user, code } = await check_permission(req);
	const { id, uid } = req.query;

	try {
		if (!user) {
			res.clearCookie("user_token");
			res.status(code).send();
			return;
		}

		if (id || uid) {
			//找尋特定文章
			let conditions = {};
			if (id) conditions.id = id;
			if (uid) conditions.id = uid;

			let result = await Post.find(conditions).populate("user").exec();
			res.json(result);
		} else {
			//找尋所有文章

			let result = await Post.find().populate("user").sort({ createdAt: "desc" }).exec();
			res.json(result);
		}
	} catch (error) {
		handle_error(error, res);
	}
};

//發布新文章
const add_post = async (req, res) => {
	const { user, code } = await check_permission(req);
	const { title, content } = req.body;

	try {
		if (!user) {
			res.clearCookie("user_token");
			res.status(code).send();
			return;
		}

		let result = await Post.create({
			user: user._id,
			title: title,
			content: content,
		});

		res.json(result);
	} catch (error) {
		handle_error(error, res);
	}
};

//上線人數
const get_online_count = async (req, res) => {
	let count = await UserSession.countDocuments({ cookie: { $ne: "" } });
	res.json(count);
};

router.route("/list").get(get_Announcement);
router.route("/add_Announce").post(add_Announcement);
router.route("/post").get(get_post);
router.route("/post").post(add_post);
router.route("/online").get(get_online_count);

export default router;
