const { Queue, Worker, Job } = require('bullmq');
const Redis = require('ioredis').default;
const path = require('path');
const fs = require('fs');
const AnimatedVideo = require('../../models/AnimatedVideo');
const move = require('./move-file');
const process = require('process');
const { captureMessage } = require('@sentry/node');
const { readdirSync } = require('fs');

const queue = new Queue('animated-video', {
  connection: new Redis(
    'rediss://red-ceadi1en6mphc8t71nvg:qaMmuQ9hi80WccfE5ldZUIUYhisD5pME@oregon-redis.render.com:6379'
  ),
});
// new Redis(
//   'rediss://red-ceadi1en6mphc8t71nvg:qaMmuQ9hi80WccfE5ldZUIUYhisD5pME@oregon-redis.render.com:6379'
// ).flushdb(() => {
//   console.log('olol');
// });

const processorFile = path.join(__dirname, 'processing.js');

const worker = new Worker(queue.name, processorFile, {
  connection: new Redis(
    'rediss://red-ceadi1en6mphc8t71nvg:qaMmuQ9hi80WccfE5ldZUIUYhisD5pME@oregon-redis.render.com:6379'
  ),
});
worker.on('error', async (job) => {
  console.error(job, 'error');
  captureMessage(JSON.stringify(job));
  await AnimatedVideo.findByIdAndUpdate(job.data.jobConfig.animated_video_id, {
    status: 'ERROR',
  });
  // Do something with the return value.
  // console.log(job, 'err');
  // const originalFolder = path.resolve(
  //   path.dirname(process.cwd() + '/') +
  //     `/pyhton-backend/data/user_data/${job.id}/animation_sound.mp4`
  // );
  // if (!fs.existsSync(originalFolder)) {
  //   console.log('olol');
  //   await AnimatedVideo.findByIdAndUpdate(
  //     job.data.jobConfig.animated_video_id,
  //     { status: 'ERROR' }
  //   );
  //   return;
  // }

  // const savedAnimatedVideoPath = path.resolve(
  //   path.dirname(process.cwd() + '/') +
  //     `/node-backend/uploads/${job.data.jobConfig.animated_video_id}`
  // );

  // if (!fs.existsSync(savedAnimatedVideoPath)) {
  //   fs.mkdirSync(savedAnimatedVideoPath);
  // }

  // fs.unlink(job.data.jobConfig.animatedVideoFolderPath, (err) => {
  //   if (err) {
  //     throw err;
  //   }
  // });

  // await AnimatedVideo.findByIdAndUpdate(job.data.jobConfig.animated_video_id, {
  //   video_url:
  //     process.env.reqHost + `/user_data/` + `${job.id}/animation_sound.mp4`,
  //   status: 'COMPLETED',
  // });
});

worker.on('failed', async (job, err) => {
  console.log('err');
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

    const lis = readdirSync(testFolder);

    console.log('faile');

    console.log(lis);
    console.log(err.message);
    console.log(err.stack);

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
  } catch (err) {
    captureMessage(err);
    console.log('ERR');
  }
});

worker.on('completed', async (job, returnvalue) => {
  console.log('completed');
  const metaJsonFilePath = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/test_data/${job.id}.json`
  );
  const testFolder = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/data/user_data/${job.id}/`
  );

  const lis = readdirSync(testFolder);

  captureMessage(job.id);
  console.log(job, 'completed');
  captureMessage(lis);
  const originalFolder = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/data/user_data/${job.id}/animation_sound.mp4`
  );
  console.log(originalFolder);
  if (!fs.existsSync(originalFolder)) {
    console.log(originalFolder);
    await AnimatedVideo.findByIdAndUpdate(job.id, { status: 'ERROR' });
    return;
  }

  // const savedAnimatedVideoPath = path.resolve(
  //   path.dirname(process.cwd() + '/') + `/node-backend/uploads/${job.id}`
  // );

  // if (!fs.existsSync(savedAnimatedVideoPath)) {
  //   fs.mkdirSync(savedAnimatedVideoPath);
  // }

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
});

const runPythonScript = async (jobConfig) => {
  const res = await queue.add(
    jobConfig.animated_video_id,
    { jobConfig },
    { jobId: jobConfig.animated_video_id }
  );
  console.log(res);
};

module.exports = runPythonScript;
