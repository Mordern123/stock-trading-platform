import mongoose, { SchemaTypes } from 'mongoose';

const Schema = mongoose.Schema;

const userSearchSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'User'
  },
  stock_id: {
    type: String,
    required: true,
  },
  stock_name: {
    type: String,
  },
  website: {
    type: String,
  },
  v: { //累積成交量
    type: String,
  },
  o: { //開盤
    type: String,
  },
  h: { //當日最高
    type: String,
  },
  l: { //當日最低
    type: String,
  },
  z: { //成交價
    type: String,
  },
  ud: { //漲跌
    type: String,
  },
  y: { //昨收
    type: String,
  },
  request_time: { //查詢時間
    type: Schema.Types.Date
  }
}, {
  timestamps: true,
});

const UserSearch = mongoose.model('UserSearch', userSearchSchema, 'userSearch');

export default UserSearch;