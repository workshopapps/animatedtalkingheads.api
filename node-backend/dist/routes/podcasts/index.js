var express = require("express");
var multer = require("multer");
var ObjectId = require("./../../utils/objectid");
var ApiError = require("../../utils/errors/ApiError");
var _require = require("./podcast.schema"), AnimatedVideoInput = _require.AnimatedVideoInput, PodcastInput = _require.PodcastInput;
var _require1 = require("../../controllers/podcast.controller"), podcastuploader = _require1.podcastuploader, getOnePodcast = _require1.getOnePodcast, getAllUserUploadedPodcast = _require1.getAllUserUploadedPodcast, generateAnimatedVideos = _require1.generateAnimatedVideos, deletePodcast = _require1.deletePodcast;
var _require2 = require("../../controllers/animatedvideo.controller"), getOneAnimatedVideo = _require2.getOneAnimatedVideo, getAllUserCreatedAnimatedVideos = _require2.getAllUserCreatedAnimatedVideos;
var auth = require("../../middlewares/authMiddleware");
var _require3 = require("typebox-express-middleware"), validateBody = _require3.validateBody, validateParams = _require3.validateParams;
var podcastRouter = express.Router();
var multerFilter = function(req, file, cb) {
    if (file.mimetype.startsWith("audio")) {
        cb(null, true);
    } else {
        cb(new ApiError("Not an audio! Please upload only audio", 400), false);
    }
};
var storage = multer.memoryStorage();
var upload = multer({
    storage: storage,
    fileFilter: multerFilter,
    limits: {
        fileSize: 500 * 1024 * 1024
    }
});
podcastRouter.post("/upload", auth, upload.single("podcast"), validateBody(PodcastInput), podcastuploader);
podcastRouter.post("/:podcastId/generate-video", auth, validateBody(AnimatedVideoInput), validateParams(ObjectId), generateAnimatedVideos);
podcastRouter.get("/", auth, getAllUserUploadedPodcast);
podcastRouter.get("/:podcastId", auth, getOnePodcast);
podcastRouter.delete("/:podcastId", auth, deletePodcast);
podcastRouter.get("/animated-videos/:animatedVideoId", auth, getOneAnimatedVideo);
podcastRouter.get("/animated-videos", auth, getAllUserCreatedAnimatedVideos);
module.exports = podcastRouter;
