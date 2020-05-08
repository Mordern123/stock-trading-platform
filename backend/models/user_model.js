import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_name: {
    type: String,
    required: true,
    trim: true,
  },
  sex: { 
    type: String,
    default: null
  },
  birthday: { 
    type: Date,
    default: null
  },
  phone_number: { 
    type: String, 
    required: false, 
    trim: true
  },
  email: {
    type: String,
    required: true
  },
  student_id: {
    type: String,
    trim: true,
    default: null
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  psd_hint: {
    type: String,
    default: null
  },
  img: {
    data: {
      type: Buffer,
      default: null
    },
    contentType: {
      type: String,
      default: null
    },
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema, 'user');

export default User;