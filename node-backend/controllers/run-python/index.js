const { Queue, Worker, Job } = require('bullmq');
const Redis = require('ioredis').default;
const path = require('path');
const fs = require('fs');
const AnimatedVideo = require('../../models/AnimatedVideo');
const move = require('./move-file');
const process = require('process');
const { captureMessage } = require('@sentry/node');
const { readdirSync } = require('fs');
const Email = require('../../utils/email');
const User = require('../../models/User');

const queue = new Queue('animated-video', {
  connection: new Redis(
    'rediss://red-ceadi1en6mphc8t71nvg:qaMmuQ9hi80WccfE5ldZUIUYhisD5pME@oregon-redis.render.com:6379'
  ),
});
// new Redis(
//   'rediss://red-ceadi1en6mphc8t71nvg:qaMmuQ9hi80WccfE5ldZUIUYhisD5pME@oregon-redis.render.com:6379'
// ).flushdb(() => {
//   console.log('queue cleared');
// });

const processorFile = path.join(__dirname, 'processing.js');

const worker = new Worker(queue.name, processorFile, {
  connection: new Redis(
    'rediss://red-ceadi1en6mphc8t71nvg:qaMmuQ9hi80WccfE5ldZUIUYhisD5pME@oregon-redis.render.com:6379'
  ),
  concurrency: 2,
});
worker.on('error', async (job) => {
  captureMessage(job);
});

worker.on('failed', async (job, err) => {
  try {
    const originalFolder = path.resolve(
      path.dirname(process.cwd() + '/') +
        `/pyhton-backend/data/user_data/${job.id}/animation_sound.mp4`
    );
    const metaJsonFilePath = path.resolve(
      path.dirname(process.cwd() + '/') +
        `/pyhton-backend/test_data/${job.id}.json`
    );
    const testFolder = path.resolve(
      path.dirname(process.cwd() + '/') +
        `/pyhton-backend/data/user_data/${job.id}/`
    );

    captureMessage(err.stack);

    // Do something with the return value.

    if (!fs.existsSync(originalFolder)) {
      await AnimatedVideo.findByIdAndUpdate(
        job.data.jobConfig.animated_video_id,
        { status: 'ERROR' }
      );
      return;
    }

    fs.unlink(metaJsonFilePath, (err) => {
      if (err) {
        throw err;
      }
    });

    await AnimatedVideo.findByIdAndUpdate(job.id, {
      video_url:
        process.env.reqHost + `/user_data/` + `${job.id}/animation_sound.mp4`,
      status: 'COMPLETED',
    });
    const user = await User.findById(animatedVid.user_id);

    const sendEmail = new Email({ ...user }, animatedVid.video_url);
    await sendEmail.sendVideo();
  } catch (err) {
    captureMessage(err);
  }
});

worker.on('completed', async (job, returnvalue) => {
  const metaJsonFilePath = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/test_data/${job.id}.json`
  );

  const originalFolder = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/data/user_data/${job.id}/animation_sound.mp4`
  );
  if (!fs.existsSync(originalFolder)) {
    await AnimatedVideo.findByIdAndUpdate(job.id, { status: 'ERROR' });
    return;
  }

  fs.unlink(metaJsonFilePath, (err) => {
    if (err) {
      throw err;
    }
  });

  const animatedVid = await AnimatedVideo.findByIdAndUpdate(job.id, {
    video_url:
      process.env.reqHost + `/user_data/` + `${job.id}/animation_sound.mp4`,
    status: 'COMPLETED',
  });

  const user = await User.findById(animatedVid.user_id);

  console.log('vid', animatedVid);

  console.log('user', user);
  console.log('url', animatedVid.video_url);

  const sendEmail = new Email({ ...user }, animatedVid.video_url);
  try {
    await sendEmail.sendVideo();
  } catch (err) {
    captureMessage(err);
  }
});

const runPythonScript = async (jobConfig) => {
  const res = await queue.add(
    jobConfig.animated_video_id,
    { jobConfig },
    { jobId: jobConfig.animated_video_id }
  );
};

module.exports = runPythonScript;
