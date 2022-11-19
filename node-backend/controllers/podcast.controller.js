const { writeFile } = require('fs/promises');
const fs = require('fs');
const Podcast = require('./../models/Podcast');

exports.podcastuploader = async (req, res) => {
  console.log(req.file);
  let podcast = await Podcast.create({
    user_id: req.headers.user_id,
    file_path: '///',
  });

  const user_file_path = './uploads/podcasts/' + req.headers.user_id + '/';

  const podcast_file_path =
    user_file_path + '-' + podcast.id + '-' + req.file.originalname;

  if (!fs.existsSync(user_file_path)) {
    fs.mkdirSync(user_file_path);
  }

  podcast = await Podcast.findOneAndUpdate(
    { id: podcast._id, user_id: req.headers.user_id },
    {
      file_path: podcast_file_path,
    }
  );

  await writeFile(podcast_file_path, req.file.buffer);
  res.send(podcast);
};
