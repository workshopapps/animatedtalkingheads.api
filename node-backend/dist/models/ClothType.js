var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var clothTypeSchema = new Schema({
    color: {
        type: String,
        default: "white",
        required: true
    },
    style: {
        type: String,
        required: true
    },
    file_path: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model("ClothType", clothTypeSchema);
