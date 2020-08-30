import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userTxnSchema = new Schema(
	{
		class_id: {
			type: String,
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		stock_id: {
			type: String,
			required: true,
		},
		stockInfo: {
			type: Object,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		order_type: {
			type: String,
			required: true,
		},
		bid_price: {
			type: Number,
			default: 0,
		},
		shares_number: {
			type: Number,
			required: true,
		},
		order_time: {
			type: Schema.Types.Date,
			required: true,
		},
		status: {
			type: String,
			default: "waiting",
		},
		txn_time: {
			type: Schema.Types.Date,
			default: null,
		},
		msg: {
			type: String,
			default: null,
		},
		closing: {
			type: Boolean,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const UserTxn = mongoose.model("UserTxn", userTxnSchema, "userTxn");

export default UserTxn;
