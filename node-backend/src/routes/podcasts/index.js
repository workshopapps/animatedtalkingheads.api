const express = require('express');
const multer = require('multer');

const ObjectId = require('./../../utils/objectid');
const ApiError = require('../../utils/errors/ApiError');
const { AnimatedVideoInput, PodcastInput } = require('./podcast.schema');
const {
  podcastuploader,
  getOnePodcast,
  getAllUserUploadedPodcast,
  generateAnimatedVideos,
  deletePodcast,
} = require('../../controllers/podcast.controller');

const {
  getOneAnimatedVideo,
  getAllUserCreatedAnimatedVideos,
} = require('../../controllers/animatedvideo.controller');
const auth = require('../../middlewares/authMiddleware');
const { validateBody, validateParams } = require('typebox-express-middleware');
const { default: rateLimit } = require('../../middlewares/rateLimit');
const podcastRouter = express.Router();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio')) {
    cb(null, true);
  } else {
    cb(new ApiError('Not an audio! Please upload only audio', 400), false);
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: multerFilter,
  limits: { fileSize: 500 * 1024 * 1024 },
});
podcastRouter.post(
  '/upload',
  auth,
  upload.single('podcast'),

  podcastuploader
);

podcastRouter.post(
  '/:podcastId/generate-video',
  rateLimit(2, 5),
  auth,
  validateBody(AnimatedVideoInput),

  generateAnimatedVideos
);
podcastRouter.get('/', auth, getAllUserUploadedPodcast);

podcastRouter.get('/:podcastId', auth, getOnePodcast);

podcastRouter.delete('/:podcastId', auth, deletePodcast);

podcastRouter.get(
  '/animated-videos/:animatedVideoId',
  auth,
  getOneAnimatedVideo
);

podcastRouter.get('/animated-videos', auth, getAllUserCreatedAnimatedVideos);

module.exports = podcastRouter;
