const { Queue, Worker, Job } = require('bullmq');
const path = require('path');
const fs = require('fs');
const AnimatedVideo = require('../../models/AnimatedVideo');
const process = require('process');
const { captureMessage } = require('@sentry/node');

const { readdirSync } = require('fs');
const { createBullBoard } = require('bull-board')
const { BullMQAdapter } = require('bull-board/bullMQAdapter')


const queue = new Queue('animated-video', {
  connection: new Redis(
    'rediss://red-ceadi1en6mphc8t71nvg:qaMmuQ9hi80WccfE5ldZUIUYhisD5pME@oregon-redis.render.com:6379'
  ),
});

const { router, setQueues, replaceQueues, addQueue, removeQueue } = createBullBoard([
  new BullMQAdapter(queue),
])



const Email = require('../../utils/email');
const User = require('../../models/User');
const redisConnection = require('../../utils/redis');

const queue = new Queue('animated-video', { ...redisConnection });

// new Redis(
//   'rediss://red-ceadi1en6mphc8t71nvg:qaMmuQ9hi80WccfE5ldZUIUYhisD5pME@oregon-redis.render.com:6379'
// ).flushdb(() => {
//   console.log('queue cleared');
// });

const processorFile = path.join(__dirname, 'processing.js');

const worker = new Worker(queue.name, processorFile, {
  ...redisConnection,

  concurrency: 2,
});
worker.on('error', async (job) => {
  console.log(job.message);
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

    fs.rmdir(testFolder, { recursive: true, force: true }, (error) => {
      throw error;
    });

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

    const animatedVid = await AnimatedVideo.findByIdAndUpdate(job.id, {
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

  const sendEmail = new Email(
    { ...user },
    process.env.reqHost + `/user_data/` + `${job.id}/animation_sound.mp4`
  );
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

module.exports = {runPythonScript, router};
