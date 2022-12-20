function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var animatedVideoSchema = new Schema({
    video_url: {
        type: String
    },
    video_path: String,
    title: {
        type: String
    },
    status: {
        required: true,
        type: String,
        enum: [
            "PENDING",
            "COMPLETED",
            "ERROR"
        ],
        default: "PENDING"
    },
    podcast_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Podcast",
        required: true
    },
    user_id: _defineProperty({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }, "required", true),
    owner: {
        type: String
    }
});
var AnimatedVideo = mongoose.model("AnimatedVideo", animatedVideoSchema);
module.exports = AnimatedVideo;
