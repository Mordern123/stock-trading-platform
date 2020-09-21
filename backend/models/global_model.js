import mongoose from "mongoose";

const Schema = mongoose.Schema;

const globalSchema = new Schema(
	{
		tag: {
			type: String,
			required: true,
			default: "hongwei",
		},
		stock_closing: {
			//是否收盤
			type: Boolean,
			required: true,
			default: true,
		},
		stock_updated: {
			//是否更新資料
			type: Boolean,
			required: true,
			default: true,
		},
		stock_update_time: {
			//收盤更新日期 ex: 2020-07-22
			type: String,
			required: true,
		},
		class: {
			type: Array,
			required: true,
			default: {},
		},
		online_count: {
			type: Number,
			required: true,
			default: 0,
		},
		shutDown_txn: {
			// 停止交易
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Global = mongoose.model("Global", globalSchema, "global");

export default Global;
