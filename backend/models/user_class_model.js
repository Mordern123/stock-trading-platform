import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userClassSchema = new Schema(
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
	},
	{
		timestamps: true,
	}
);

const UserClass = mongoose.model("UserClass", userClassSchema, "userClass");

export default UserClass;
