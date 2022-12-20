var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//i removed name of hair, coz we already have type of hair
var hairTypeSchema = new Schema({
    style: {
        type: String,
        required: true,
        default: "black"
    },
    color: {
        type: String,
        required: true
    },
    file_path: {
        type: String,
        required: true
    }
});
var Hairtype = mongoose.model("HairType", hairTypeSchema);
module.exports = Hairtype;
