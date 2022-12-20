//store podcast id
"use strict";
const getId = (req, res, next)=>{
    req.podcastId = req.params.podcastid;
    next();
};
module.exports = getId;
