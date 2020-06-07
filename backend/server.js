import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { Server } from 'http'
import Socket from 'socket.io'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user'
import classRouter from './routes/class'
import stockRouter from './routes/stock'
import txnRouter from './routes/transaction'
require('dotenv').config()

global.userKey = {} //使用者Token

const app = express();
const port = process.env.PORT || 5000;
const server = Server(app);
const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
  console.log("The database is " + connection.name)
})

mongoose.connect(process.env.DB_CONN_STRING, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);


var allowedOrigins = ['http://localhost:3000','http://localhost'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: err
  });
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});