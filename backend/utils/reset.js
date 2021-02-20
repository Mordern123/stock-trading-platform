import mongoose from "mongoose";
import UserClass from "../models/user_class_model";
import UserStock from "../models/user_stock_model";
import UserTxn from "../models/user_txn_model";
import Account from "../models/account_model";
import User from "../models/user_model";
import moment from "moment";
require("dotenv").config();

//重置程序開始
const Run = () => {
	if (!["CLASS1", "CLASS2", "CLASS3"].includes(process.argv[2])) {
		console.log("錯誤參數");
		process.exit();
	}
	const class_id = process.argv[2];
	const connection = mongoose.connection;
	connection.once("open", async () => {
		console.log("MongoDB database connection established successfully");
		console.log("The database is " + connection.name);

		//取得所有使用者
		const all_users = await UserClass.find({ class_id }).lean().exec();
		const all_user_ids = all_users.map((item) => item.user);
		console.log(all_user_ids);
		await reset_account(all_user_ids);
		await reset_user_stock(all_user_ids);
		await reset_transactions(all_user_ids);
		process.exit();
	});
	mongoose.set("useFindAndModify", false);
	mongoose.connect(process.env.DB_CONN_STRING, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});
};

//重置帳戶
const reset_account = async (ids = []) => {
	const updateTime = moment().toDate();
	await Account.updateMany(
		{
			user: {
				$in: ids,
			},
		},
		{
			balance: 2000000,
			total_amount: 0,
			stock_number: 0,
			stock_value: 0,
			txn_count: 0,
			last_update: updateTime,
			last_value_update: updateTime,
			updatedAt: updateTime,
		}
	).exec();
	console.log("所有帳戶重置完成!");
};

//重置用戶擁有股票
const reset_user_stock = async (ids = []) => {
	await UserStock.deleteMany({
		user: {
			$in: ids,
		},
	}).exec();
	console.log("重置所有用戶擁有股票完成!");
};

//重置所有交易
const reset_transactions = async (ids = []) => {
	await UserTxn.deleteMany({
		user: {
			$in: ids,
		},
	}).exec();
	console.log("重置所有交易完成!");
};

Run();
