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
