const fs = require('fs');
const AnimatedVideo = require('../models/AnimatedVideo');
const Podcast = require('../models/Podcast');
const User = require('../models/User');
const PromiseMap = require('bluebird').map;

const deleteAnonUser = async () => {
  let aMonthAgoDate = new Date();
  aMonthAgoDate.setDate(aMonthAgoDate.getDate() - 30);
  const users = await User.find({
    last_time_accessed: { $lte: aMonthAgoDate },
  });

  await PromiseMap(
    users,
    async (user) => {
      try {
        const animatedVideoPath = path.resolve(
          path.dirname(process.cwd() + '/') +
            `/uploads/animated-videos/${user.id}`
        );

        const audioPath = path.resolve(
          path.dirname(process.cwd() + '/') + `/uploads/podcasts/${user.id}/`
        );
        fs.rmSync(animatedVideoPath, (err) => {
          if (err) {
            throw err;
          }
        });
        fs.rmSync(audioPath, (err) => {
          if (err) {
            throw err;
          }
        });
        await Podcast.deleteMany({ user_id: user.id });
        await AnimatedVideo.deleteMany({ user_id: user.id });
        await User.findByIdAndDelete(user._id);
      } catch (err) {
        console.error(err);
      }
    },
    { concurrency: 1 }
  );
};

deleteAnonUser;
