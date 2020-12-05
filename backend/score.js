import xlsx from 'xlsx'
import mongoose from "mongoose";
import User from "./models/user_model"
import Account from "./models/account_model"
require("dotenv").config();

const class_name_list = ["財富管理實務", "網路理財", "投資學與金融科技"] //依據需求更改
const class_id_list = ["CLASS1", "CLASS2", "CLASS3"] //依據需求更改

const Run = () => {
	const connection = mongoose.connection;
	connection.once("open", () => {
		console.log("MongoDB database connection established successfully");
		console.log("The database is " + connection.name);
		generate_excel();
	});
	mongoose.set("useFindAndModify", false);
	mongoose.connect(process.env.DB_CONN_STRING, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});
};

const generate_excel = async() => {
  const workBook = {
    SheetNames: class_name_list,
    Sheets: {}
  }
  for(let i = 0; i < class_id_list.length; i++) {
    const class_data = []
    const accounts = await Account.find({ class_id: class_id_list[i]}).sort({ total_amount: 'desc' }).populate("user").lean().exec()
    
    let rank = 1;
    for(let j = 0; j < accounts.length; j++) {
      const { balance, stock_number, stock_value, total_amount, txn_count, class_id, user } = accounts[j]

      if(balance !== 2000000)  {
        class_data.push({
          "名次": rank,
          "學號": user.student_id.slice(0,7) + "**" + user.student_id.slice(9),
          "帳戶總價值": total_amount,
          "帳戶餘額": balance,
          "股票價值": stock_value,
          "擁有股票數量": stock_number,
          "交易總次數": txn_count
        })
        rank++
      }
    }
    const _total_amount = getBebeQ(class_data.map(i => i['帳戶總價值']))
    const _balance = getBebeQ(class_data.map(i => i['帳戶餘額']))
    const _stock_value = getBebeQ(class_data.map(i => i['股票價值']))
    const _stock_number = getBebeQ(class_data.map(i => i['擁有股票數量']), 0)
    const _txn_count = getBebeQ(class_data.map(i => i['交易總次數']), 0)

    class_data.push({})
    class_data.push({
      "名次": "",
      "學號": "最高",
      "帳戶總價值": _total_amount.max,
      "帳戶餘額": _balance.max,
      "股票價值": _stock_value.max,
      "擁有股票數量": _stock_number.max,
      "交易總次數": _txn_count.max
    })
    class_data.push({
      "名次": "",
      "學號": "最低",
      "帳戶總價值": _total_amount.min,
      "帳戶餘額": _balance.min,
      "股票價值": _stock_value.min,
      "擁有股票數量": _stock_number.min,
      "交易總次數":_txn_count.min
    })
    class_data.push({
      "名次": "",
      "學號": "平均",
      "帳戶總價值": _total_amount.avg,
      "帳戶餘額": _balance.avg,
      "股票價值": _stock_value.avg,
      "擁有股票數量": _stock_number.avg,
      "交易總次數": _txn_count.avg
    })
    class_data.push({
      "名次": "",
      "學號": "中位數",
      "帳戶總價值": _total_amount.mid,
      "帳戶餘額": _balance.mid,
      "股票價值": _stock_value.mid,
      "擁有股票數量": _stock_number.mid,
      "交易總次數": _txn_count.mid
    })
    class_data.push({
      "名次": "",
      "學號": "標準差",
      "帳戶總價值": _total_amount.stdDev,
      "帳戶餘額": _balance.stdDev,
      "股票價值": _stock_value.stdDev,
      "擁有股票數量": _stock_number.stdDev,
      "交易總次數": _txn_count.stdDev
    })
    
    //存進excel
    const jsonWorkSheet = xlsx.utils.json_to_sheet(class_data);
    workBook.Sheets[class_name_list[i]] = jsonWorkSheet
  }

  //寫入excel
  xlsx.writeFile(workBook, "./學生成績排名.xlsx");
  process.exit()
}

// @numbers 包含所有数字的一维数组
// @digit 保留数值精度小数位数，默认两位小数
const getBebeQ = (numbers, digit = 2) => {
  // 修复js浮点数精度误差问题
  const formulaCalc = function formulaCalc(formula, digit) {
    let pow = Math.pow(10, digit);
    return parseInt(formula * pow, 10) / pow;
  };
  let len = numbers.length;
  let sum = (a, b) => formulaCalc(a + b, digit);
  let max = Math.max.apply(null, numbers);
  let min = Math.min.apply(null, numbers);
  // 平均值
  let avg = numbers.reduce(sum) / len;
  let mid = getMedian(numbers)
  // 计算标准差
  // 所有数减去其平均值的平方和，再除以数组个数（或个数减一，即变异数）再把所得值开根号
  let stdDev = Math.sqrt(numbers.map(n=> (n-avg) * (n-avg)).reduce(sum) / len);
  return {
    max,
    min,
    avg: avg.toFixed(digit),
    mid: parseFloat(mid).toFixed(digit),
    stdDev : stdDev.toFixed(digit)
  }
}

//取中位數
function getMedian (arr) {
  arr = arr.sort((a, b) => a - b)
  let median
  if (arr.length % 2 === 0) {
    // 數目為偶數
    median = (arr[arr.length / 2] + arr[arr.length / 2 - 1]) / 2
  } else {
    // 數目為奇數
    median = arr[(arr.length - 1) / 2 ]
  }
  return median
}

Run() //執行