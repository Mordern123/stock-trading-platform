import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema(
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
		post: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Post",
		},
		message: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

const Comment = mongoose.model("Comment", commentSchema, "comment");

export default Comment;
