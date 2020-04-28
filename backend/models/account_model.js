import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    unique: true,
    required: true,
    ref: 'User'
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  stock_number: {
    type: Number,
    required: true,
    default: 0
  },
  stock_value: {
    type: Number,
    required: true,
    default: 0
  },
  last_update: {
    type: Date,
    required: true,
  }
}, {
  timestamps: true,
});

const AccountSchema = mongoose.model('AccountSchema', accountSchema, 'account');

export default AccountSchema;