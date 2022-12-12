const { Queue, Worker, Job } = require('bullmq');
const Redis = require('ioredis').default;
const path = require('path');
const fs = require('fs');
const AnimatedVideo = require('../../models/AnimatedVideo');
const move = require('./move-file');
const process = require('process');
const { captureMessage } = require('@sentry/node');

const queue = new Queue('animated-video', {
  connection: new Redis(
    'rediss://red-ceadi1en6mphc8t71nvg:qaMmuQ9hi80WccfE5ldZUIUYhisD5pME@oregon-redis.render.com:6379'
  ),
});
// new Redis(
//   'rediss://red-ceadi1en6mphc8t71nvg:qaMmuQ9hi80WccfE5ldZUIUYhisD5pME@oregon-redis.render.com:6379'
// ).flushdb(()=>{
//   console.log('olol')
// })

const processorFile = path.join(__dirname, 'processing.js');

const worker = new Worker(queue.name, processorFile, {
  connection: new Redis(
    'rediss://red-ceadi1en6mphc8t71nvg:qaMmuQ9hi80WccfE5ldZUIUYhisD5pME@oregon-redis.render.com:6379'
  ),
});
worker.on('error', async (job) => {
  console.error('error', job);
  captureMessage(JSON.stringify(job));
  // Do something with the return value.
  console.log('err', job);
  const originalFolder = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/data/user_data/${job.data.jobConfig.animated_video_id}/animation_sound.mp4`
  );
  if (!fs.existsSync(originalFolder)) {
    console.log('olol');
    await AnimatedVideo.findByIdAndUpdate(
      job.data.jobConfig.animated_video_id,
      { status: 'ERROR' }
    );
    return;
  }

  const savedAnimatedVideoPath = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/node-backend/uploads/${job.data.jobConfig.animated_video_id}`
  );

  if (!fs.existsSync(savedAnimatedVideoPath)) {
    fs.mkdirSync(savedAnimatedVideoPath);
  }

  fs.unlink(job.data.jobConfig.animatedVideoFolderPath, (err) => {
    if (err) {
      throw err;
    }
  });

  await AnimatedVideo.findByIdAndUpdate(job.data.jobConfig.animated_video_id, {
    video_url:
      process.env.reqHost + `/user_data/` + `${job.id}/animation_sound.mp4`,
    status: 'COMPLETED',
  });
});

worker.on('failed', async (job, err) => {
  console.log('failed');

  console.log(err.name);
  console.log(err.message);
  console.log(err.stack);

  captureMessage({ name: err.name, message: err.message, stack: err.stack });

  // Do something with the return value.
  const originalFolder = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/data/user_data/${job.data.jobConfig.animated_video_id}/animation_sound.mp4`
  );
  console.log(originalFolder);
  if (!fs.existsSync(originalFolder)) {
    await AnimatedVideo.findByIdAndUpdate(
      job.data.jobConfig.animated_video_id,
      { status: 'ERROR' }
    );
    return;
  }

  fs.unlink(job.data.jobConfig.meta_json_file, (err) => {
    if (err) {
      throw err;
    }
  });

  await AnimatedVideo.findByIdAndUpdate(job.data.jobConfig.animated_video_id, {
    video_url:
      process.env.reqHost + `/user_data/` + `${job.id}/animation_sound.mp4`,
    status: 'COMPLETED',
  });
});

worker.on('completed', async (job, returnvalue) => {
  const metaJsonFilePath = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/test_data/${job.id}.json`
  );
  captureMessage(job.id);
  console.log('completed', job);

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
