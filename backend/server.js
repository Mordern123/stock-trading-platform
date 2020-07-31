import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { Server } from 'http'
import logger from 'morgan'
import PQueue from 'p-queue'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user'
import classRouter from './routes/class'
import stockRouter from './routes/stock'
import txnRouter from './routes/transaction'
import Global from './models/global_model'
import { start_txn_schedule, start_get_closingStock_schedule, start_closing_schedule, start_opening_schedule } from './schedule'

require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;
const server = Server(app);
const connection = mongoose.connection;
export const queue = new PQueue({ concurrency: 3, interval: 1000, intervalCap: 3}); //工作管理佇列，每1秒reset，1秒內不能同時執行超過3個程序

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
  console.log("The database is " + connection.name)
  
  //啟動排程
  start_txn_schedule()
  start_get_closingStock_schedule()
  start_closing_schedule()
  start_opening_schedule()
})

mongoose.connect(process.env.DB_CONN_STRING, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

//允許cors要求網址
var allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000','http://localhost:8080','http://127.0.0.1:8080','http://192.168.0.6:8080','http://35.229.149.140:80'];
app.use(cors({
  origin: (origin, callback) => { return callback(null, true) },
  // origin: function(origin, callback){
  //   // allow requests with no origin 
  //   // (like mobile apps or curl requests)
  //   if(!origin) return callback(null, true);
  //   if(allowedOrigins.indexOf(origin) === -1){
  //     var msg = 'The CORS policy for this site does not ' +
  //               'allow access from the specified Origin.';
  //     return callback(new Error(msg), false);
  //   }
  //   return callback(null, true);
  // },
  credentials: true
}));

app.use(cookieParser('hongwei0417')) //cookie簽章
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'))
app.use('/user', userRouter)
app.use('/class', classRouter)
app.use('/stock', stockRouter)
app.use('/txn', txnRouter)

app.get('/test', async(req, res) => {
  const doc = await Global.findOne({ tag: "hongwei"}).exec()
  res.json(doc)
})

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});