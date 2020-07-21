import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const globalSchema = new Schema({
  tag: {
    type: String,
    required: true,
    default: "hongwei"
  },
  stock_closing: { //是否收盤
    type: Boolean,
    required: true,
    default: true
  },
  stock_update: { //收盤更新日期 ex: 2020-07-22
    type: String,
  }
}, {
  timestamps: true,
});

const Global = mongoose.model('Global', globalSchema, 'global');

export default Global;