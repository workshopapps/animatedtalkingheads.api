const fs = require('fs');
const path = require('path');
const { writeFile, readFile } = require('fs/promises');
const Podcast = require('./../models/Podcast');
const ApiError = require('../utils/errors/ApiError');
const NotFound = require('../utils/errors/NotFound');
const runPythonScript = require('./run-python');
const AnimatedVideo = require('../models/AnimatedVideo');
const User = require('../models/User');
function randomIntFromInterval() {
  // min and max included
  let val = Math.floor(Math.random() * (13 - 1 + 1) + 1);
  val = String(val);
  if (val < 10) {
    val = 0 + val;
    return val;
  }

  return val;
}

exports.generateAnimatedVideos = async (req, res, next) => {
  console.log(req.decoded.email);
  const fetchedUser = await User.findOne({ email: req.decoded.email });
  let animatedVideoDoc = await AnimatedVideo.findById(
    req.headers.animated_video_id
  );
  if (!animatedVideoDoc) {
    animatedVideoDoc = await AnimatedVideo.create({
      podcast_id: req.params.podcastId,
      user_id: fetchedUser._id,
      // to use this later after phasing out user_id
      // owner:req.decoded.email
    });
  }

  const podcastDoc = await Podcast.findById(req.params.podcastId);
  const metaJson = {
    audio_path: podcastDoc.file_path,
    audio_url: podcastDoc.file_url,
    avatar_map: {
      A: '01',
      B: '02',
    },
    bg_path: req.body.bg_path || randomIntFromInterval(),
    dir_id: animatedVideoDoc.id,
  };

  console.log(metaJson);

  const metaJsonFilePath = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/test_data/${animatedVideoDoc._id}.json`
  );
  const animatedVideoFolderPath = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/data/user_data/${animatedVideoDoc._id}`
  );

  const metaJsonFile = await writeFile(
    metaJsonFilePath,
    JSON.stringify(metaJson),
    'utf-8'
  );
  const jobConfig = {
    ...metaJson,
    user_id: req.headers.userid,
    animated_video_id: animatedVideoDoc.id,
    meta_json_file: metaJsonFilePath,
    animatedVideoFolderPath,
    reqHost: req.protocol + '://' + req.get('host'),
  };
  await runPythonScript(jobConfig);
  res.json(animatedVideoDoc);
};

exports.podcastuploader = async (req, res, next) => {
  console.log(req.headers.user_id);
  const user_file_path = (
    '/uploads/podcasts/' +
    req.headers.user_id +
    '/'
  ).replaceAll(' ', '');
  const fileExt = req.file.originalname ? req.file.originalname : req.file.ext;
  let save_file_directory =
    user_file_path + req.headers.user_id + '-' + Date.now() + fileExt;

  save_file_directory = save_file_directory.replaceAll(' ', '');

  //find user with email decoded from token
  const fetchedUser = await User.findById(req.headers.user_id);
  console.log(fetchedUser);
  //use the found user id as user_id
  let podcast = await Podcast.create({
    user_id: fetchedUser._id,
    file_name:req.body.file_name,
    file_url: req.protocol + '://' + req.get('host') + save_file_directory,
    file_path: path.resolve(process.cwd(), '.' + save_file_directory),
  });
  if (!fs.existsSync('.' + user_file_path)) {
    fs.mkdirSync('.' + user_file_path);
  }

  try {
    await writeFile('.' + save_file_directory, req.file.buffer);
  } catch (err) {
    podcast = await Podcast.findOneAndDelete({
      id: podcast._id,
      user_id: req.fetchedUser._id,
    });
    console.error(err);
    return next(
      new ApiError('Podcast wasnt uploaded successfully', 400),
      false
    );
  }

  res.send(podcast);
};

exports.getOnePodcast = async (req, res, next) => {
  try {
    const fetchedUser = await User.findOne({ email: req.decoded.email });
    const podcast = await Podcast.findOne({
      _id: req.params.podcastId,
      user_id: fetchedUser._id,
      // to use this later after phasing out user_id
      // owner:req.decoded.email
    });

    if (!podcast) {
      return next(new NotFound());
    }
    res.json(podcast);
  } catch (err) {
    next(err);
  }
};

exports.getAllUserUploadedPodcast = async (req, res, next) => {
  try {
    const fetchedUser = await User.findOne({ email: req.decoded.email });
    const podcasts = await Podcast.find({
      user_id: fetchedUser._id,
      // to use this later after phasing out user_id
      // owner:req.decoded.email
    });

    // if (podcast.length < ) {
    //   next(new NotFound());
    // }
    res.json(podcasts);
  } catch (err) {
    next(err);
  }
};
