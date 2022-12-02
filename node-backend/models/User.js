const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
  },
  last_time_accessed: {
    type: Date,
    default: Date.now(),
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', UserSchema);
