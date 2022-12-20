var Redis = require("ioredis");
var redisConnection = {
    connection: new Redis(process.env.NODE_ENV == "production" ? "rediss://red-ceadi1en6mphc8t71nvg:qaMmuQ9hi80WccfE5ldZUIUYhisD5pME@oregon-redis.render.com:6379" : "redis://default:q0YwoL1z1XopazAhd9AfeEqDbJMUCSae@redis-11738.c14.us-east-1-3.ec2.cloud.redislabs.com:11738")
};
module.exports = redisConnection;
