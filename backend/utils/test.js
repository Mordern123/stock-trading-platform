import { txn_crawl_pcHome_stock } from "../website/pcHome";
import axios from "axios";
import bodyFormData from'form-data';
require("dotenv").config();

const Run = async() => {
        // let testStock = ["1234","0050","2330","1444"];
        // let stockName = ["黑松","元大50","台積電","力麗"];
        // for(let k = 0 ; k<10 ; k++){
        //     for(let i = 0 ; i < testStock.length ; i++){
        //          await txn_crawl_pcHome_stock(testStock[i],stockName[i],print);
        //     console.log(testStock[i]);
        //     }
        // }
        const url ="https://pchome.megatime.com.tw/stock/sid0050.html"
        const response = await axios.post(url, bodyFormData, {
            headers: bodyFormData.getHeaders(),
           });
        console.log(response);
};

// const print = async(result) => {
//     console.log(result);
// }

Run() //執行