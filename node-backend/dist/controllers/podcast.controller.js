"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _uuid = require("uuid");
const fs = require('fs');
const path = require('path');
const { writeFile  } = require('fs/promises');
const Podcast = require('./../models/Podcast');
const ApiError = require('../utils/errors/ApiError');
const NotFound = require('../utils/errors/NotFound');
const { runPythonScript  } = require('./run-python');
const AnimatedVideo = require('../models/AnimatedVideo');
const User = require('../models/User');
exports.generateAnimatedVideos = async (req, res, next)=>{
    // console.log(req.decoded.email);
    const fetchedUser = await User.findOne({
        email: req.decoded.email
    });
    let animatedVideoDoc = await AnimatedVideo.findById(req.headers.animated_video_id);
    if (!animatedVideoDoc) {
        animatedVideoDoc = await AnimatedVideo.create({
            podcast_id: req.params.podcastId,
            user_id: fetchedUser._id
        });
    }
    const podcastDoc = await Podcast.findById(req.params.podcastId);
    //   audio_path: podcastDoc.file_path,
    // audio_url: podcastDoc.file_url,
    const metaJson = {
        audio_path: 'C:\\Users\\Hi\\Documents\\hng9\\animatedtalkingheads.api\\node-backend\\uploads\\podcasts\\63983192640d3dd05f080c6b\\63983192640d3dd05f080c6b-1671868383217WhatAJoke_S04E01_SigningIn.mp3',
        audio_url: 'https://api.voxclips.hng.tech/uploads/podcasts/63a2cc9e51b0fcb236ba3de6/63a2cc9e51b0fcb236ba3de6-1671867883550WhatAJoke_S04E01_SigningIn.mp3',
        avatar_map: req.body.avatar_map,
        bg_path: req.body.bg_path,
        dir_id: animatedVideoDoc.id
    };
    const metaJsonFilePath = path.resolve(path.dirname(process.cwd() + '/') + `/pyhton-backend/test_data/${animatedVideoDoc._id}.json`);
    const animatedVideoFolderPath = path.resolve(path.dirname(process.cwd() + '/') + `/pyhton-backend/data/user_data/${animatedVideoDoc._id}`);
    const metaJsonFile = await writeFile(metaJsonFilePath, JSON.stringify(metaJson), 'utf-8');
    const jobConfig = {
        ...metaJson,
        user_id: req.headers.userid,
        animated_video_id: animatedVideoDoc.id,
        meta_json_file: metaJsonFilePath,
        animatedVideoFolderPath,
        reqHost: req.protocol + '://' + req.get('host')
    };
    await runPythonScript(jobConfig);
    res.json(animatedVideoDoc);
};
exports.podcastuploader = async (req, res, next)=>{
    const user_file_path = ('/uploads/podcasts/' + req.headers.user_id + '/').replaceAll(' ', '');
    const fileExt = req.file.originalname ? req.file.originalname : req.file.ext;
    let save_file_directory = user_file_path + req.headers.user_id + '-' + Date.now() + fileExt;
    save_file_directory = save_file_directory.replaceAll(' ', '');
    //find user with email decoded from token
    const fetchedUser = await User.findById(req.headers.user_id);
    //use the found user id as user_id
    let podcast = await Podcast.create({
        user_id: fetchedUser._id,
        file_name: (0, _uuid.v4)(),
        file_url: req.protocol + '://' + req.get('host') + save_file_directory,
        file_path: path.resolve(process.cwd(), '.' + save_file_directory)
    });
    if (!fs.existsSync('.' + user_file_path)) {
        fs.mkdirSync('.' + user_file_path);
    }
    try {
        await writeFile('.' + save_file_directory, req.file.buffer);
    } catch (err) {
        podcast = await Podcast.findOneAndDelete({
            id: podcast._id,
            user_id: req.fetchedUser._id
        });
        console.error(err);
        return next(new ApiError('Podcast wasnt uploaded successfully', 400), false);
    }
    res.send(podcast);
};
exports.getOnePodcast = async (req, res, next)=>{
    try {
        const fetchedUser = await User.findOne({
            email: req.decoded.email
        });
        const podcast = await Podcast.findOne({
            _id: req.params.podcastId,
            user_id: fetchedUser._id
        });
        if (!podcast) {
            return next(new NotFound());
        }
        res.json(podcast);
    } catch (err) {
        next(err);
    }
};
exports.getAllUserUploadedPodcast = async (req, res, next)=>{
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.page) || 20;
        const skip = (page - 1) * limit;
        const fetchedUser = await User.findOne({
            email: req.decoded.email
        });
        const podcasts = await Podcast.find({
            user_id: fetchedUser._id
        }).limit(limit).skip(skip);
        // if (podcast.length < ) {
        //   next(new NotFound());
        // }
        res.json(podcasts);
    } catch (err) {
        next(err);
    }
};
exports.deletePodcast = async (req, res, next)=>{
    try {
        let podcast = await Podcast.findById({
            _id: req.params.podcastId,
            user_id: req.headers.user_id
        });
        if (!podcast) next(new NotFound());
        fs.unlink(podcast.file_path, (err)=>{
            throw err;
        });
        await podcast.remove();
        res.status(204).send();
    } catch (err) {
        console.log(err);
        next(err);
    }
};
