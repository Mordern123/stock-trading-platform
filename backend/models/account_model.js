import mongoose, { SchemaTypes } from "mongoose";
require("mongoose-long")(mongoose);
const Schema = mongoose.Schema;

const accountSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			unique: true,
			required: true,
			ref: "User",
		},
		class_id: {
			type: Schema.Types.String,
			required: true,
		},
		balance: {
			type: Schema.Types.Long,
			required: true,
			default: 0,
		},
		stock_number: {
			type: Schema.Types.Long,
			required: true,
			default: 0,
		},
		stock_value: {
			type: Schema.Types.Long,
			required: true,
			default: 0,
		},
		initial_money: {
			type: Schema.Types.Long,
			required: true,
			default: 2000000,
		},
		total_amount: {
			type: Schema.Types.Long,
			required: true,
			default: 0,
		},
		txn_count: {
			type: Schema.Types.Long,
			required: true,
			default: 0,
		},
		last_update: {
			type: Date,
			required: true,
		},
		last_value_update: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const AccountSchema = mongoose.model("AccountSchema", accountSchema, "account");

export default AccountSchema;
