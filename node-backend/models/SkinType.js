const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skinTypeSchema = new Schema({
  color: {
    type: String,
    required: true,
  },
  file_path: {
    type: String,
    required: true,
  },
});

const SkinType = mongoose.model('SkinType', skinTypeSchema);
module.exports = SkinType;
