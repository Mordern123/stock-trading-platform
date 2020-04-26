import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userStockSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'User'
  },
  stock_id: {
    type: String,
    required: true,
  },
  stock: {
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'Stock'
  },
  shares_number: {
    type: Number,
    required: true,
  },
  last_update: {
    type: Schema.Types.Date,
  }
}, {
  timestamps: true,
});

userStockSchema.index({ user: 1, stock_id: 1}, { unique: true });
const UserStock = mongoose.model('UserStock', userStockSchema, 'userStock');

export default UserStock;