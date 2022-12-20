"use strict";
const AnimatedVideo = require('../models/AnimatedVideo');
const NotFound = require('../utils/errors/NotFound');
const fs = require('fs');
const path = require('path');
exports.getOneAnimatedVideo = async (req, res, next)=>{
    try {
        const animatedVideoDoc = await AnimatedVideo.findOne({
            user_id: req.headers.user_id,
            // to use this later after phasing out user_id
            // owner:req.decoded.email
            _id: req.params.animatedVideoId
        });
        if (!animatedVideoDoc) {
            return next(new NotFound());
        }
        res.json(animatedVideoDoc);
    } catch (err) {
        next(err);
    }
};
exports.getAllUserCreatedAnimatedVideos = async (req, res, next)=>{
    try {
        const status = req.query.status;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const query = {
            user_id: req.header.user_id
        };
        status && (query['status'] = status);
        const animatedVideoDocs = await AnimatedVideo.find(query).limit(limit).skip(skip);
        if (!animatedVideoDocs.length) {
            return next(new NotFound());
        }
        res.json('animatedVideoDocs');
    } catch (err) {
        console.log('err');
        next(err);
    }
};
exports.deleteAnimatedVideo = async (req, res, next)=>{
    try {
        let animatedVideoDoc = await AnimatedVideo.findOne({
            _id: req.params.animatedVideoId,
            user_id: req.headers.user_id
        });
        if (!animatedVideoDoc) next(new NotFound());
        const animatedVideoFolder = path.resolve(process.cwd() + '/' + `/pyhton-backend/data/user_data/${animatedVideoDoc.id}`);
        fs.rmdir(animatedVideoFolder, {
            recursive: true,
            force: true
        }, (err)=>{
            throw err;
        });
        await animatedVideoDoc.remove();
        res.status(204).send();
    } catch (err) {
        console.error(err);
        next(err);
    }
};
