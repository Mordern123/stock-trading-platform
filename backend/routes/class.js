import { Router } from "express";
import Announcement from "../models/announce_model";
import UserSession from "../models/user_session_model";
import UserClass from "../models/user_class_model";
import Comment from "../models/comment_model";
import Global from "../models/global_model";
import Post from "../models/post_model";
import { check_permission } from "../common/auth";
import { handle_error } from "../common/error";

const router = Router();

const add_Announcement = async (req, res) => {
	try {
		const { user, code } = await check_permission(req);
		const { class_id, title, subTitle, content, publisher, publish_date } = req.body;

		if (!user) {
			res.clearCookie("user_token");
			res.status(code).send();
			return;
		}

		const result = await Announcement.create({
			class_id,
			title,
			subTitle,
			content,
			publisher,
			publish_date,
		});
		res.json(result);
	} catch (error) {
		res.json("新增失敗!");
	}
};

const get_Announcement = async (req, res) => {
	try {
		const { user, code } = await check_permission(req);

		if (!user) {
			res.clearCookie("user_token");
			res.status(code).send();
			return;
		}

		const doc = await UserClass.findOne({ user: user._id }).exec();
		// 沒有userClass物件的帳戶就不限班級取得全部
		if (doc) {
			const result = await Announcement.find({ class_id: doc.class_id })
				.populate("publisher", "user_name")
				.sort({ publish_date: "desc" })
				.exec();
			res.json(result);
		} else {
			const result = await Announcement.find({ class_id: "GLOBAL_CLASS" })
				.populate("publisher", "user_name")
				.sort({ publish_date: "desc" })
				.exec();
			res.json(result);
		}
	} catch (error) {
		handle_error(error, res);
	}
};

//取得文章
const get_post = async (req, res) => {
	const { user, code } = await check_permission(req);
	const { post_id } = req.query;

	try {
		if (!user) {
			res.clearCookie("user_token");
			res.status(code).send();
			return;
		}

		//是否要找尋特定文章
		if (post_id) {
			let result = await Post.findById(post_id).populate("user").exec();
			res.json(result);
		} else {
			const doc = await UserClass.findOne({ user: user._id }).exec();
			// 沒有userClass物件的帳戶就不限班級取得全部
			if (doc) {
				//找尋班級所有文章
				let result = await Post.find({ class_id: doc.class_id })
					.populate("user")
					.sort({ createdAt: "desc" })
					.exec();
				res.json(result);
			} else {
				let result = await Post.find().populate("user").sort({ createdAt: "desc" }).exec();
				res.json(result);
			}
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

		const doc = await UserClass.findOne({ user: user._id }).exec();

		let result = await Post.create({
			class_id: doc ? doc.class_id : "GLOBAL_CLASS",
			user: user._id,
			title: title,
			content: content,
		});
		res.json(result);
	} catch (error) {
		handle_error(error, res);
	}
};

//取得留言
const get_comment = async (req, res) => {
	const { user, code } = await check_permission(req);
	const { post_id } = req.query;

	try {
		if (!user) {
			res.clearCookie("user_token");
			res.status(code).send();
			return;
		}

		//找尋指定文章所有留言
		let result = await Comment.find({ post: post_id })
			.sort({ createdAt: "desc" })
			.populate("user")
			.exec();

		res.json(result);
	} catch (error) {
		handle_error(error, res);
	}
};

//發布留言
const add_comment = async (req, res) => {
	const { user, code } = await check_permission(req);
	const { post_id, message } = req.body;

	try {
		if (!user) {
			res.clearCookie("user_token");
			res.status(code).send();
			return;
		}

		if (!post_id) {
			res.json(false);
			return;
		}

		const doc = await UserClass.findOne({ user: user._id }).exec();

		//新增一筆留言
		await Comment.create({
			class_id: doc ? doc.class_id : "GLOBAL_CLASS",
			user: user._id,
			post: post_id,
			message: message,
		});

		//文章留言數加1
		let result = await Post.findByIdAndUpdate(post_id, { $inc: { comment_count: 1 } }).exec();

		res.json(result);
	} catch (error) {
		handle_error(error, res);
	}
};

//取得上線人數
const get_online_count = async (req, res) => {
	// let count = await UserSession.countDocuments({ cookie: { $ne: "" } });
	res.json(online_count); // global全域變數
};

//取得使用者所屬課堂
const get_user_class = async (req, res) => {
	const { user, code } = await check_permission(req);

	try {
		if (!user) {
			res.clearCookie("user_token");
			res.status(code).send();
			return;
		}

		let doc = await UserClass.findOne({ user: user._id }).lean().exec();

		if (doc) {
			res.json(doc.class_id);
		} else {
			res.json(false);
		}
	} catch (error) {
		handle_error(error, res);
	}
};

router.route("/list").get(get_Announcement);
router.route("/add_Announce").post(add_Announcement);
router.route("/post").get(get_post);
router.route("/post").post(add_post);
router.route("/comment").get(get_comment);
router.route("/comment").post(add_comment);
router.route("/online").get(get_online_count);
router.route("/user").get(get_user_class);

export default router;
