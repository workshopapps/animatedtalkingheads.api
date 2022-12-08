const { Queue, Worker, Job } = require('bullmq');
const Redis = require('ioredis').default;
const path = require('path');
const fs = require('fs');
const AnimatedVideo = require('../../models/AnimatedVideo');
const move = require('./move-file');
const process = require('process');

const queue = new Queue('animated-video', {
  connection: new Redis(
    `redis://aaron:${process.env.REDIS_PASSWORD}@redis-18458.c13.us-east-1-3.ec2.cloud.redislabs.com:18458`
  ),
});
const processorFile = path.join(__dirname, 'processing.js');

const worker = new Worker(queue.name, processorFile, {
  concurrency: 2,
  connection: new Redis(
    `redis://aaron:${process.env.REDIS_PASSWORD}@redis-18458.c13.us-east-1-3.ec2.cloud.redislabs.com:18458`
  ),
});

worker.on('error', (err) => {
  console.log({ error: { err } });
});
worker.on('failed', async (job, err) => {
  console.log(err);
  // Do something with the return value.
  const originalFolder = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/data/user_data/${job.data.jobConfig.animated_video_id}/animation.mp4`
  );
  if (!fs.existsSync(originalFolder)) {
    await AnimatedVideo.findByIdAndUpdate(
      job.data.jobConfig.animated_video_id,
      { status: 'ERROR' }
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

  await AnimatedVideo.findByIdAndUpdate(job.data.jobConfig.animated_video_id, {
    video_url:
      job.data.jobConfig.reqHost +
      `/uploads/` +
      `${job.data.jobConfig.animated_video_id}/animation.mp4`,
    status: 'COMPLETED',
  });
});
worker.on('resumed', (job) => {
  console.log({ resumed: { job, err } });
});
worker.on('completed', async (job, returnvalue) => {
  // Do something with the return value.
  console.log({ job, returnvalue });
  const originalFolder = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/data/user_data/${job.data.jobConfig.animated_video_id}/animation.mp4`
  );
  if (!fs.existsSync(originalFolder)) {
    await AnimatedVideo.findByIdAndUpdate(
      job.data.jobConfig.animated_video_id,
      { status: 'ERROR' }
    );
  }
});

const runPythonScript = async (jobConfig, pathToMeta) => {
  await queue.add(
    jobConfig.animated_video_id,
    { jobConfig },
    {
      removeOnComplete: {
        age: 3600, // keep up to 1 hour
        count: 50, // keep up to 1000 jobs
      },
      removeOnFail: {
        age: 24 * 3600, // keep up to 24 hours
        count: 50,
      },
    }
  );

  await AnimatedVideo.findByIdAndUpdate(job.data.jobConfig.animated_video_id, {
    video_path:
      req.protocol +
      '://' +
      req.get('host') +
      `/uploads/` +
      `${job.data.jobConfig.animated_video_id}/animation.mp4`,
    status: 'COMPLETED',
  });
});

const runPythonScript = async (jobConfig) => {
  const res = await queue.add(jobConfig.animated_video_id, { jobConfig }, {});
};

module.exports = runPythonScript;
