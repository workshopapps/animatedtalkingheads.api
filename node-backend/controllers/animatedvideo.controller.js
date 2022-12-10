const AnimatedVideo = require('../models/AnimatedVideo');
const NotFound = require('../utils/errors/NotFound');

exports.getOneAnimatedVideo = async (req, res, next) => {
  try {
    const animatedVideoDoc = await AnimatedVideo.findOne({
      user_id: req.headers.user_id,
      // to use this later after phasing out user_id
      // owner:req.decoded.email
      _id: req.params.animatedVideoId,
    });
    if (!animatedVideoDoc) {
      return next(new NotFound());
    }
    res.json(animatedVideoDoc);
  } catch (err) {
    next(err);
  }
};

exports.getAllUserCreatedAnimatedVideos = async (req, res, next) => {
  try {
    const animatedVideoDocs = await AnimatedVideo.find({
      user_id: req.header.user_id,
    });
    if (!animatedVideoDocs.length) {
      return next(new NotFound());
    }
    res.json('animatedVideoDocs');
  } catch (err) {
    console.log('err');
    next(err);
  }
};
