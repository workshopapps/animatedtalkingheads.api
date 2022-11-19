const express = require('express');
const multer = require('multer');
const checkUser = require('../../middlewares/checkUser');

const schemaMiddleware = require('../../middlewares/schemaMiddleware');
const ApiError = require('../../utils/errors/ApiError');
const { podcastSchema } = require('./podcast.schema');
const { podcastuploader } = require('../../controllers/podcast.controller');

const podcastRouter = express.Router();

podcastRouter.get('/:userid',require('../../middlewares/idstore'),require('../../controllers/podcastgetter'));

podcastRouter.delete('/:podcastid',require('../../middlewares/podcastidstore'),require('../../controllers/podcastdeleter'))

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio')) {
    cb(null, true);
  } else {
    cb(new ApiError('Not an audio! Please upload only audio', 400), false);
  }
};

const storage = multer.memoryStorage();

const upload = multer({ storage, fileFilter: multerFilter });
podcastRouter.post(
  '/upload',
  checkUser,
  upload.single('podcast'),
  schemaMiddleware(podcastSchema),
  podcastuploader
);

podcastRouter.get('/download',(req,res)=> {
  const {filename} = req.body
  res.download(filename)
});

module.exports = podcastRouter;
