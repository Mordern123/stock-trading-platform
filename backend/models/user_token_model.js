import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userTokenSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		post: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Post",
		},
		token_number: {
			type: Schema.Types.Decimal128,
			required: true,
		},
		txn: {
			type: Object,
			required: true,
		},
		txn_time: {
			type: Schema.Types.Date,
		},
	},
	{
		timestamps: true,
	}
);

const UserToken = mongoose.model("UserToken", userTokenSchema, "userToken");

export default UserToken;
