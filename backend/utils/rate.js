import mongoose from "mongoose";
import Account from "../models/account_model";
require("dotenv").config();
const class_id_list = ["CLASS1"] //依據需求更改

const Run = () => {
	const connection = mongoose.connection;
	connection.once("open", () => {
		console.log("MongoDB database connection established successfully");
		console.log("The database is " + connection.name);
		set_rate();
	});
	mongoose.set("useFindAndModify", false);
	mongoose.connect(process.env.DB_CONN_STRING, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});
};

const set_rate = async() => {
    
    const accounts = await Account.find({}).exec()
    for(let j = 0; j < accounts.length; j++) {
        const acconut = accounts[j];
        const rate = (((acconut.total_amount-acconut.initial_money)/acconut.initial_money)*100).toFixed(3)
        await Account.findByIdAndUpdate(
        acconut._id,
        { investment_rate: (((acconut.total_amount-acconut.initial_money)/acconut.initial_money)*100).toFixed(3) }
        ).exec();
    }
    
    
    process.exit();
}

Run() //執行