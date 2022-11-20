const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//i removed name of hair, coz we already have type of hair
const hairTypeSchema = new Schema({
  style: {
    type: String,
    required: true,
    default:"black"
  },
  color: {
    type: String,
    required: true,
  },
  file_path: {
    type: String,
    required: true,
  },
});

const Hairtype = mongoose.model('HairType', hairTypeSchema);
module.exports = Hairtype;
