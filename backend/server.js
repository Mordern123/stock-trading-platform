import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { Server } from 'http'
import Socket from 'socket.io'
import userRouter from './routes/user'
import classRouter from './routes/class'
import stockRouter from './routes/stock'
import txnRouter from './routes/transaction'
require('dotenv').config()

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

app.use(cors());
app.use(express.json());
app.use('/user', userRouter)
app.use('/class', classRouter)
app.use('/stock', stockRouter)
app.use('/txn', txnRouter)

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});