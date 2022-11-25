const { writeFile } = require('fs/promises');
const fs = require('fs');
const Podcast = require('./../models/Podcast');
const ApiError = require('../utils/errors/ApiError');

exports.podcastuploader = async (req, res) => {
  const user_file_path = './uploads/podcasts/' + req.headers.user_id + '/';
  const save_file_directory =
    user_file_path +
    req.headers.user_id +
    '-' +
    Date.now() +
    '-' +
    req.file.originalname;

  let podcast = await Podcast.create({
    user_id: req.headers.user_id,
    file_path: save_file_directory,
  });

  if (!fs.existsSync(user_file_path)) {
    fs.mkdirSync(user_file_path);
  }

  try {
    await writeFile(save_file_directory, req.file.buffer);
  } catch (err) {
    podcast = await Podcast.findOneAndDelete({
      id: podcast._id,
      user_id: req.headers.user_id,
    });
    cb(new ApiError('Podcast wasnt uploaded successfully', 400), false);
  }

  res.send(podcast);
};
