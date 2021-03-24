import mongoose from "mongoose";
import Account from "../models/account_model";
// import UserClass from "../models/user_class_model";
// import Account from "../models/account_model";
require("dotenv").config();

//const class_name_list = ["財富管理實務", "網路理財", "投資學與金融科技"] //依據需求更改
const class_id_list = ["CLASS1", "CLASS2", "CLASS3"] //依據需求更改

const Run = () => {
	const connection = mongoose.connection;
	connection.once("open", () => {
		console.log("MongoDB database connection established successfully");
		console.log("The database is " + connection.name);
		set_initial_money();
	});
	mongoose.set("useFindAndModify", false);
	mongoose.connect(process.env.DB_CONN_STRING, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});
};

const set_initial_money = async() => {
    
    const accounts = await Account.find({}).exec()
    for(let j = 0; j < accounts.length; j++) {
        const acconut = accounts[j]
        //const userid = await User.find({ user: user._id }).lean().exec()
        await Account.findByIdAndUpdate(
        acconut._id,
        { initial_money: 2000000 }
        ).exec();
    }
    
    
    process.exit();
}

Run() //執行