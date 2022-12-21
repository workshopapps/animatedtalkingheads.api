"use strict";
const Bree = require('bree');
const path = require('path');
const runCronJobs = async ()=>{
    const bree = new Bree({
        jobs: [
            {
                name: 'Deleteinactiveuser',
                path: './jobs/Deleteinactiveuser.js',
                cron: '60 * 60 * 24 * 30'
            }
        ]
    });
    await bree.start();
};
module.exports = runCronJobs;
