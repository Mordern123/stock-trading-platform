import mongoose from "mongoose";

const Schema = mongoose.Schema;

const errorSchema = new Schema(
   {
        user: {
            type: Schema.Types.ObjectId,
            unique: true,
            required: true,
            ref: "User",
        },
        error_msg: {
            type: Object,
            // default: null,
        },
        operation_type: {
            trpe: String,
            // default: null,
        },
        website: {
            type: String,
            // default: null,
        },

   },
    {
        timestamps: true,
    }

)
const ErrorHandle = mongoose.model("ErrorHandle", errorSchema, "errorHandle");

export default ErrorHandle;
