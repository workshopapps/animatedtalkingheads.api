"use strict";
const Redis = require('ioredis');
const redisConnection = {
    connection: new Redis(process.env.NODE_ENV == 'production' ? process.env.REDIS_PROD_URL : process.env.REDIS_DEV_URL)
};
module.exports = redisConnection;
