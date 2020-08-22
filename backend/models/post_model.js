import mongoose, { SchemaTypes } from "mongoose";
const Schema = mongoose.Schema;

const postSchema = new Schema(
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
		title: {
			type: Schema.Types.String,
			required: true,
		},
		content: {
			type: Schema.Types.String,
			required: true,
		},
		comment_count: {
			type: Schema.Types.Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

const PostSchema = mongoose.model("Post", postSchema, "post");

export default PostSchema;
