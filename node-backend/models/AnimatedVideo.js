const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const animatedVideoSchema = new Schema({
  video_url: {
    type: String,
  },
  status: {
    required: true,
    type: String,
    enum: ['PENDING', 'COMPLETED', 'ERROR'],
    default: 'PENDING',
  },
  podcast_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Podcast',
    required: true,
  },

  user_id: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  owner:{
    type:String
  }
});

const AnimatedVideo = mongoose.model('AnimatedVideo', animatedVideoSchema);

module.exports = AnimatedVideo;
