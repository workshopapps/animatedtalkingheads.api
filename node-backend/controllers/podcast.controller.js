const { writeFile } = require('fs/promises');
const fs = require('fs');
const Podcast = require('./../models/Podcast');
const ApiError = require('../utils/errors/ApiError');
const path = require('path');
const runPythonScript = require('./run-python');

// runPythonScript();
exports.podcastuploader = async (req, res, next) => {
  const user_file_path = (
    '/uploads/podcasts/' +
    req.headers.user_id +
    '/'
  ).replaceAll(' ', '');

  const save_file_directory = (
    user_file_path +
    req.headers.user_id +
    '-' +
    Date.now() +
    '-' +
    req.file.originalname
  ).replaceAll(' ', '');
  let podcast = await Podcast.create({
    user_id: req.headers.user_id,
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
      user_id: req.headers.user_id,
    });
    console.error(err);
    return next(
      new ApiError('Podcast wasnt uploaded successfully', 400),
      false
    );
  }

  res.send(podcast);
};
