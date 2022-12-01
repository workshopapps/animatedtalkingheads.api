const IORedis = require('ioredis');
const { Queue, Worker, Job } = require('bullmq');
const path = require('path');
const fs = require('fs');
const AnimatedVideo = require('../../models/AnimatedVideo');

let connection = new IORedis(
  'redis://aaronkenny:WT@UK8JRsriW4Jb@redis-18458.c13.us-east-1-3.ec2.cloud.redislabs.com:18458'
);

// Reuse the ioredis instance
const myQueue = new Queue('myqueue', { connection });
const processorFile = path.join(__dirname, 'processing.js');
const worker = new Worker(myQueue.name, processorFile, {
  connection,
  concurrency: 2,
});
worker.on('completed', async (job, returnvalue) => {
  // Do something with the return value.
  if (returnvalue.success) {
    await AnimatedVideo.findByIdAndUpdate(
      returnvalue.jobConfig.animated_video_id,
      { video_path: returnvalue.video_path, status: 'COMPLETED' }
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
