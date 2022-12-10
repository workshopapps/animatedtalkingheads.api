const { Queue, Worker, Job } = require('bullmq');
const Redis = require('ioredis').default;
const path = require('path');
const fs = require('fs');
const AnimatedVideo = require('../../models/AnimatedVideo');
const move = require('./move-file');
const process = require('process');

const queue = new Queue('animated-video', {
  connection: new Redis(
    `rediss://red-cea9mpmn6mphc8sr23og:dObuYF379PgpTY3v4QgJJG5XDgjE7gau@oregon-redis.render.com:6379`
  ),
});
const clearQueue = async () => {
  await queue.clean();
};
clearQueue();
const processorFile = path.join(__dirname, 'processing.js');

const worker = new Worker(queue.name, processorFile, {
  connection: new Redis(
    `rediss://red-cea9mpmn6mphc8sr23og:dObuYF379PgpTY3v4QgJJG5XDgjE7gau@oregon-redis.render.com:6379`
  ),
  concurrency: process.env.NODE_ENV ? 1 : 2,
});
worker.on('error', async (job) => {
  // Do something with the return value.
  console.log('error', job);
  const originalFolder = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/data/user_data/${job.data.jobConfig.animated_video_id}/animation.mp4`
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

  move(
    originalFolder,
    path.resolve(
      path.dirname(process.cwd() + '/') +
        `/node-backend/uploads/${job.data.jobConfig.animated_video_id}/animation.mp4`
    ),
    () => {
      fs.unlink(job.data.jobConfig.animatedVideoFolderPath, (err) => {
        if (err) {
          throw err;
        }
      });
      fs.unlink(job.data.jobConfig.meta_json_file, (err) => {
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

worker.on('failed', async (job, err) => {
  console.log('failed', err);
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
    return;
  }

  const savedAnimatedVideoPath = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/node-backend/uploads/${job.data.jobConfig.animated_video_id}`
  );

  if (!fs.existsSync(savedAnimatedVideoPath)) {
    fs.mkdirSync(savedAnimatedVideoPath);
  }

  move(
    originalFolder,
    path.resolve(
      path.dirname(process.cwd() + '/') +
        `/node-backend/uploads/${job.data.jobConfig.animated_video_id}/animation.mp4`
    ),
    (err) => {
      if (err) console.log(err);
      fs.rmSync(job.data.jobConfig.animatedVideoFolderPath, {
        recursive: true,
        force: true,
      });

      fs.unlink(job.data.jobConfig.meta_json_file, (err) => {
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

worker.on('completed', async (job, returnvalue) => {
  console.log('complete', job);
  const originalFolder = path.resolve(
    path.dirname(process.cwd() + '/') +
      `/pyhton-backend/data/user_data/${job.data.jobConfig.animated_video_id}/animation.mp4`
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

  move(
    originalFolder,
    path.resolve(
      path.dirname(process.cwd() + '/') +
        `/node-backend/uploads/${job.data.jobConfig.animated_video_id}/animation.mp4`
    ),
    () => {
      fs.rmdir(
        job.data.jobConfig.animatedVideoFolderPath,
        { recursive: true, force: true },
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
      fs.unlink(job.data.jobConfig.meta_json_file, (err) => {
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

const runPythonScript = async (jobConfig) => {
  const res = await queue.add(jobConfig.animated_video_id, { jobConfig });
};

module.exports = runPythonScript;
