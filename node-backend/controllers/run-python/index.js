const IORedis = require('ioredis');
const { Queue, Worker, Job } = require('bullmq');
const path = require('path');
const fs = require('fs');
const AnimatedVideo = require('../../models/AnimatedVideo');
const move = require('./move-file');
const process = require('process');

let connection = new IORedis(
  `redis://aaron:${process.env.REDIS_PASSWORD}@redis-18458.c13.us-east-1-3.ec2.cloud.redislabs.com:1845`
);
console.log(
  `redis://aaron:${process.env.REDIS_PASSWORD}@redis-18458.c13.us-east-1-3.ec2.cloud.redislabs.com:1845`
);
// Reuse the ioredis instance
const queue = new Queue('myqueue', { connection });
const processorFile = path.join(__dirname, 'processing.js');
const worker = new Worker(queue.name, processorFile, {
  connection,
  concurrency: 2,
});
worker.on('completed', async (job, returnvalue) => {
  // Do something with the return value.
  if (returnvalue.success) {
    const savedAnimatedVideoPath = path.resolve(
      path.dirname(process.cwd() + '/') +
        `node-backend/data/uploads/${returnvalue.jobConfig.animated_video_id}`
    );

    if (!fs.existsSync(savedAnimatedVideoPath)) {
      fs.mkdirSync(savedAnimatedVideoPath);
    }

    move(
      path.resolve(
        path.dirname(process.cwd() + '/') +
          `pyhton-backend/data/user_data/${returnvalue.jobConfig.animated_video_id}/animation.mp4`
      ),
      path.resolve(
        path.dirname(process.cwd() + '/') +
          `node-backend/data/uploads/${returnvalue.jobConfig.animated_video_id}/animation.mp4`
      ),
      () => {
        console.log('jjj');
      }
    );

    await AnimatedVideo.findByIdAndUpdate(
      returnvalue.jobConfig.animated_video_id,
      {
        video_path:
          req.protocol +
          '://' +
          req.get('host') +
          `/uploads/` +
          `${returnvalue.jobConfig.animated_video_id}/animation.mp4`,
        status: 'COMPLETED',
      }
    );
  } else {
    await AnimatedVideo.findByIdAndUpdate(
      returnvalue.jobConfig.animated_video_id,
      { status: 'ERROR' }
    );
  }

  fs.unlink(returnvalue.jobConfig.meta_json_file, (err) => {
    if (err) {
      throw err;
    }
  });
});

const runPythonScript = async (jobConfig, pathToMeta) => {
  await queue.add(jobConfig.animated_video_id, jobConfig, {
    removeOnComplete: {
      age: 3600, // keep up to 1 hour
      count: 50, // keep up to 1000 jobs
    },
    removeOnFail: {
      age: 24 * 3600, // keep up to 24 hours
      count: 50,
    },
  });
};

module.exports = runPythonScript;
