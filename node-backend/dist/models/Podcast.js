var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var podcastSchema = new Schema({
    file_path: {
        type: String,
        required: true
    },
    file_name: {
        type: String
    },
    file_url: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});
var Podcast = mongoose.model("Podcast", podcastSchema);
module.exports = Podcast;
