const Bree = require('bree');
const path = require('path');
const runCronJobs = async () => {
  const bree = new Bree({
    jobs: [
      {
        name: 'detele_anon_users',
        path: './jobs/deleteAnonUsers.js',
        interval: 'every 30 days',
      },
    ],
  });
  await bree.start();
};

module.exports = runCronJobs;
