const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  last_time_accessed: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
