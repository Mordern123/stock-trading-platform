import mongoose from "mongoose";
import UserStock from "./models/user_stock_model";
import UserTxn from "./models/user_txn_model";
import Account from "./models/account_model";
import User from "./models/user_model";
import moment from 'moment'
require("dotenv").config();

//重置程序開始
const Run = () => {
	const connection = mongoose.connection;
	connection.once("open", async() => {
		console.log("MongoDB database connection established successfully");
        console.log("The database is " + connection.name);
        
        //取得所有使用者
        const all_users = await User.find().exec();
		await reset_account(all_users)
		await reset_user_stock()
		await reset_transactions()
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
const reset_account = async(users) => {
    for(let i = 0; i < users.length; i++) {
		const updateTime = moment().toDate()
        await Account.findOneAndUpdate({user: users[i]._id}, {
			balance: 2000000,
			total_amount: 0,
			stock_number: 0,
			stock_value: 0,
			txn_count: 0,
			last_update: updateTime,
			last_value_update: updateTime,
			updatedAt:  updateTime,
		})
	}
	console.log("所有帳戶重置完成!")
}

//重置用戶擁有股票
const reset_user_stock = async() => {
	await UserStock.deleteMany({}).exec()
	console.log("重置所有用戶擁有股票完成!")
}

//重置所有交易
const reset_transactions = async() => {
	await UserTxn.deleteMany({}).exec()
	console.log("重置所有交易完成!")
}

Run();