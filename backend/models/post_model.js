import mongoose, { SchemaTypes } from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: Schema.Types.String,
    required: true,
  },
  content: {
    type: Schema.Types.String,
    required: true,
  },
}, {
  timestamps: true,
});

const PostSchema = mongoose.model('PostSchema', postSchema, 'post');

export default PostSchema;