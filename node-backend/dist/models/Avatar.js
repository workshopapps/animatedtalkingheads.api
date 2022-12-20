var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Avatar = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    audio_url: {
        type: String,
        required: true
    },
    audio_path: {
        type: String,
        required: true
    },
    avatar_map: {
        type: Object,
        required: true
    },
    bg_path: {
        type: String,
        required: true
    },
    dir_id: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model("Avatar", Avatar);
