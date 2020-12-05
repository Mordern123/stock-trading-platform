import mongoose from "mongoose";
import User from "./models/user_model"
import UserClass from "./models/user_class_model"
import Account from "./models/account_model"
require("dotenv").config();

const user_data1 = [
    "4106030332",
    "4106033117",
    "4106035010",
    "4106035030",
    "4106040060",
    "4106043003",
    "4106043010",
    "4106043043",
    "4106044024",
    "4106044042",
    "4106054110",
    "4106054114",
    "4106061019",
    "4106061032",
    "4106061038",
    "4106065003",
    "4106065006",
    "4106065017",
    "4106065031",
    "4107030301",
    "4107034018",
    "4107034021",
    "4107034059",
    "4107039047",
    "4107052049",
    "4107054010",
    "4107054025",
    "4107062019",
    "4107062044",
    "4107062125",
    "4108031014",
    "4108031048",
    "4108032021",
    "4108033019",
    "4108037036",
    "4108043027",
    "4108062042",
    "4108065017",
    "4108065024",
    "4108065039",
    "4108065040",
    "4109012030",
    "4109029038",
    "4109034019",
    "4109038010",
    "4109042011",
    "4109042046",
    "4109066027"
]

const Run = () => {
	const connection = mongoose.connection;
	connection.once("open", () => {
		console.log("MongoDB database connection established successfully");
		console.log("The database is " + connection.name);
		check_user("CLASS1", user_data1);
	});
	mongoose.set("useFindAndModify", false);
	mongoose.connect(process.env.DB_CONN_STRING, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});
};

//檢查學生交易狀態
const check_user = async(classID, user_data) => {
    const results = []
    for(let i = 0; i < user_data.length; i++) {
        const student_id = user_data[i]
        const user_result = { student_id }
        const user = await User.findOne({ student_id }).lean().exec()
        
        if(user) {
            const userClass = await UserClass.findOne({ user: user._id }).lean().exec()
            const account = await Account.findOne({ user: user._id }).lean().exec()
            if(!userClass) {
                user_result.reason = "不存在userClass"
            } else if(!account) {
                user_result.reason = "不存在account"
            } else if(userClass.class_id !== classID) {
                user_result.reason = "帳號創建課程錯誤"
            } else if(account.txn_count < 3) {
                user_result.reason = "交易小於3次"
            }
        } else {
            user_result.reason = "尚未創建帳號"
        }
        if(user_result.reason) {
            results.push(user_result)
        }
    }
    console.log(results)
    console.log(`【${classID}】班級共${user_data.length}個學生`)
    process.exit()
}

Run();