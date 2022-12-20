var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var skinTypeSchema = new Schema({
    color: {
        type: String,
        required: true
    },
    file_path: {
        type: String,
        required: true
    }
});
var SkinType = mongoose.model("SkinType", skinTypeSchema);
module.exports = SkinType;
