const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const podcastSchema = new Schema({
  file_path: {
    type: String,
    required: true,
  },
  file_name: {
    type: String,
  },
  file_url: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
},
{timestamps:true});
const Podcast = mongoose.model('Podcast', podcastSchema);
module.exports = Podcast;
