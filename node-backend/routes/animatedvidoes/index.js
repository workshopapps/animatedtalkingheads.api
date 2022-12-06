const express = require('express');
const multer = require('multer');
const checkUser = require('../../middlewares/checkUser');

const schemaMiddleware = require('../../middlewares/schemaMiddleware');
const ApiError = require('../../utils/errors/ApiError');
const { podcastSchema } = require('./podcast.schema');
const {
  generateAnimatedVideos,
} = require('../../controllers/podcast.controller');
const {
  getOneAnimatedVideo,
  getAllUserCreatedAnimatedVideos,
} = require('../../controllers/animatedvideo.controller');
const animatedVideo = express.Router();

animatedVideo.get('/:animatedVideoId', checkUser, getOneAnimatedVideo);

animatedVideo.get('/', checkUser, getAllUserCreatedAnimatedVideos);

animatedVideo.get('/lol', getAllUserCreatedAnimatedVideos);

module.exports = animatedVideo;
