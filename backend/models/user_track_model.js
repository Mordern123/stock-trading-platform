import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userTrackSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'User'
  },
  stock_id: {
    type: String,
    required: true,
  },
  track_time: {
    type: Schema.Types.Date,
  }
}, {
  timestamps: true,
});

userTrackSchema.index({ user: 1, stock_id: 1}, { unique: true });
const UserTrack = mongoose.model('UserTrack', userTrackSchema, 'userTrack');

export default UserTrack;