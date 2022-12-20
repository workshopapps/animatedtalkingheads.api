//store podcast id
var getId = function(req, res, next) {
    req.podcastId = req.params.podcastid;
    next();
};
module.exports = getId;
