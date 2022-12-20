"use strict";
const express = require('express');
const checkUser = require('../../middlewares/checkUser');
const AnimatedVideo = require('./../../models/AnimatedVideo');
const ApiError = require('../../utils/errors/ApiError');
const NotFound = require('../../utils/errors/NotFound');
// const {
//   generateAnimatedVideos,
// } = require('../../controllers/podcast.controller');
const { getOneAnimatedVideo , getAllUserCreatedAnimatedVideos , deleteAnimatedVideo  } = require('../../controllers/animatedvideo.controller');
const auth = require('../../middlewares/authMiddleware');
const animatedVideoRouter = express.Router();
animatedVideoRouter.get('/:animatedVideoId', auth, async (req, res, next)=>{
    try {
        const animatedVideoDoc = await AnimatedVideo.findOne({
            user_id: req.headers.user_id,
            _id: req.params.animatedVideoId
        });
        if (!animatedVideoDoc) {
            return next(new NotFound());
        }
        res.json(animatedVideoDoc);
    } catch (err) {
        next(err);
    }
});
// animatedVideoRouter.get(
//   '/:animatedVideoId/cancel',
//   auth,
//   async (req, res, next) => {
//     try {
//       const animatedVideoDoc = await AnimatedVideo.findOne({
//         user_id: req.headers.user_id,
//         _id: req.params.animatedVideoId,
//       });
//       if (!animatedVideoDoc) {
//         return next(new NotFound());
//       }
//       if (animatedVideoDoc.status !== 'PENDING') {
//         return next(
//           new ApiError('the nimated video is no longer in the queue', 400)
//         );
//       }
//       res.json(animatedVideoDoc);
//     } catch (err) {
//       next(err);
//     }
//   }
// );
animatedVideoRouter.get('/', auth, async (req, res, next)=>{
    try {
        const animatedVideoDocs = await AnimatedVideo.find({
            user_id: req.headers.user_id
        });
        if (!animatedVideoDocs.length) {
            return next(new NotFound());
        }
        res.json(animatedVideoDocs);
    } catch (err) {
        console.log('err');
        next(err);
    }
});
animatedVideoRouter.delete('/:animatedVideoId', auth, deleteAnimatedVideo);
module.exports = animatedVideoRouter;
