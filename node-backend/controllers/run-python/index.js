const { Queue, Worker, Job } = require('bullmq');
const Redis = require('ioredis').default;
const path = require('path');
const fs = require('fs');
const AnimatedVideo = require('../../models/AnimatedVideo');
const move = require('./move-file');
const process = require('process');

let connection = new Redis(
  `redis://aaron:${process.env.REDIS_PASSWORD}@redis-18458.c13.us-east-1-3.ec2.cloud.redislabs.com:18458`
);

const queue = new Queue('myqueue', {
  connection: new Redis(
    `redis://aaron:${process.env.REDIS_PASSWORD}@redis-18458.c13.us-east-1-3.ec2.cloud.redislabs.com:18458`
  ),
});
const processorFile = path.join(__dirname, 'processing.js');
console.log(processorFile);
const worker = new Worker(queue.name, processorFile, {
  connection: new Redis(
    `redis://aaron:${process.env.REDIS_PASSWORD}@redis-18458.c13.us-east-1-3.ec2.cloud.redislabs.com:18458`
  ),
});
worker.on('error', (err) => {
  console.log({ err });
});
worker.on('failed', (job, err) => {
  console.log({ job, err });
});
worker.on('resumed', (job) => {
  console.log({ job, err });
});
worker.on('completed', async (job, returnvalue) => {
  console.log(returnvalue);
  // Do something with the return value.
  if (returnvalue.success) {
    const savedAnimatedVideoPath = path.resolve(
      path.dirname(process.cwd() + '/') +
        `/node-backend/data/uploads/${returnvalue.jobConfig.animated_video_id}`
    );

    if (!fs.existsSync(savedAnimatedVideoPath)) {
      fs.mkdirSync(savedAnimatedVideoPath);
    }

    move(
      path.resolve(
        path.dirname(process.cwd() + '/') +
          `/pyhton-backend/data/user_data/${returnvalue.jobConfig.animated_video_id}/animation.mp4`
      ),
      path.resolve(
        path.dirname(process.cwd() + '/') +
          `/node-backend/data/uploads/${returnvalue.jobConfig.animated_video_id}/animation.mp4`
      ),
      () => {
        fs.unlink(returnvalue.jobConfig.animatedVideoFolderPath, (err) => {
          if (err) {
            throw err;
          }
        });
        fs.unlink(returnvalue.jobConfig.meta_json_file, (err) => {
          if (err) {
            throw err;
          }
        });
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
});

const runPythonScript = async (jobConfig) => {
  const res = await queue.add(
    jobConfig.animated_video_id,
    { jobConfig },
    { priority: 10 }
  );
};

module.exports = runPythonScript;
