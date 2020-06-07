import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSessionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'User'
  },
  cookie: {
    type: String,
  },
}, {
  timestamps: true,
});

const UserSession = mongoose.model('UserSession', userSessionSchema, 'userSession');

export default UserSession;