import mongoose from "mongoose";

const Schema = mongoose.Schema;

const announceSchema = new Schema(
	{
		class_id: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		subTitle: {
			type: String,
			required: true,
			trim: true,
		},
		content: {
			type: Array,
			default: [],
		},
		publisher: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		publish_date: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Announcement = mongoose.model("Announcement", announceSchema, "announcement");

export default Announcement;
