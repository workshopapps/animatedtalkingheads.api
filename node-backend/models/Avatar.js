const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//added required to be true for all id documents here including gender. The ids would be set  in the node script
// i removed the extra-layer to access the contents of accessories, so you're short of one traversal when accessing accessories after population
// added speaker model
const Avatar = new Schema({
  name: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'neutral'],
  },
  podcast_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Podcast',
    required: true,
  },
  accessories: {
    cloth_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClothType',
      required: true,
    },
    hair_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HairType',
      required: true,
    },
    skin_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkinType',
      required: true,
    },
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Avatar', Avatar);
