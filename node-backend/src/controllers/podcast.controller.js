const fs = require('fs');
const path = require('path');
const { writeFile } = require('fs/promises');
const Podcast = require('./../models/Podcast');
import { v4 as uuidv4 } from 'uuid';
import InvalidFile from '../utils/errors/InvalidFile';
const ApiError = require('../utils/errors/ApiError');
const NotFound = require('../utils/errors/NotFound');
const { runPythonScript } = require('./run-python');
const AnimatedVideo = require('../models/AnimatedVideo');
const User = require('../models/User');

exports.generateAnimatedVideos = async (req, res, next) => {
  let animatedVideoDoc = await AnimatedVideo.findById(
    req.headers.animated_video_id
  );
  if (!animatedVideoDoc) {
    animatedVideoDoc = await AnimatedVideo.create({
      podcast_id: req.params.podcastId,
      user_id: req.decoded.id,
      // to use this later after phasing out user_id
      // owner:req.decoded.email
    });
  }

  const podcastDoc = await Podcast.findById(req.params.podcastId);

  const metaJson = {
    audio_path: podcastDoc.file_path,
    audio_url: podcastDoc.file_url,
    avatar_map: req.body.avatar_map,
    bg_path: req.body.bg_path,
    dir_id: animatedVideoDoc.id,
  };

  const metaJsonFilePath = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/test_data/${animatedVideoDoc._id}.json`
  );
  const animatedVideoFolderPath = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/data/user_data/${animatedVideoDoc._id}`
  );

  await writeFile(metaJsonFilePath, JSON.stringify(metaJson), 'utf-8');
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
  if (!req.file) {
    return next(new InvalidFile());
  }
  const optionalName = uuidv4();
  const { fileTypeFromBuffer } = await import('file-type');

  console.log(req.headers.user_id);
  const uploadPath = '/uploads/podcasts/' + req.headers.user_id + '/';

  const fileExt = req.file.originalname
    ? req.file.originalname
    : optionalName + '.' + (await fileTypeFromBuffer(req.file.buffer)).ext;

  let relativeFileDir =
    uploadPath + req.headers.user_id + '-' + Date.now() + fileExt;
  //find user with email decoded from token
  const fetchedUser = await User.findById(req.headers.user_id);

  //use the found user id as user_id
  let podcast = await Podcast.create({
    user_id: fetchedUser._id,
    file_name: req.file.originalname ? req.file.originalname : optionalName,
    file_url: req.protocol + '://' + req.get('host') + relativeFileDir,
    file_path: path.resolve(process.cwd(), '.' + relativeFileDir),
  });
  if (!fs.existsSync('.' + uploadPath)) {
    fs.mkdirSync('.' + uploadPath);
  }

  try {
    await writeFile('.' + relativeFileDir, req.file.buffer);
  } catch (err) {
    console.log(err);
    podcast = await Podcast.findOneAndDelete({
      id: podcast._id,
      user_id: req.decoded.id,
    });

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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.page) || 20;
    const skip = (page - 1) * limit;

    const podcasts = await Podcast.find({
      user_id: req.decoded.id,
      // to use this later after phasing out user_id
      // owner:req.decoded.email
    })
      .limit(limit)
      .skip(skip);

    if (!podcasts.length) {
      next(new NotFound());
    }
    res.json(podcasts);
  } catch (err) {
    next(err);
  }
};

exports.deletePodcast = async (req, res, next) => {
  try {
    let podcast = await Podcast.findById({
      _id: req.params.podcastId,
      user_id: req.headers.user_id,
    });
    if (!podcast) next(new NotFound());
    fs.unlink(podcast.file_path, (err) => {
      throw err;
    });
    await podcast.remove();
    res.status(204).send();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
