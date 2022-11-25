const IORedis = require('ioredis');
const { Queue, Worker, Job } = require('bullmq');
const path = require('path');

const runQueue = async (queue, jobId, data) => {
  await queue.add(jobId, data, {
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

const runPythonScript = async () => {
  let connection = new IORedis(
    'redis://aaronkenny:WT@UK8JRsriW4Jb@redis-18458.c13.us-east-1-3.ec2.cloud.redislabs.com:18458'
  );
  // new IORedis({
  //     username: "aaronkenny",
  //     host: "redis-18458.c13.us-east-1-3.ec2.cloud.redislabs.com",
  //     port: 18458,
  //     password: "WT@UK8JRsriW4Jb",
  //     maxRetriesPerRequest: null,
  //   });
  // Reuse the ioredis instance
  const myQueue = new Queue('myqueue', { connection });
  const processorFile = path.join(__dirname, 'processing.js');

  const worker = new Worker(myQueue.name, processorFile, { connection });
  worker.on('completed', (job, returnvalue) => {
    // Do something with the return value.
    console.log('done', returnvalue);
  });
  await runQueue(myQueue, 'text', "import os;print(os.getcwd() + ' ' + 'k')");
};

module.exports = runPythonScript;
