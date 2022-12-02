const Podcast = require('./../models/Podcast');
const ApiError = require('../utils/errors/ApiError');

const getpodcast = async (req, res,next) => {
  try{
    let podcast = await Podcast.find({user_id:req.headers.user_id})
    res.send(podcast);
  }

  catch(err){
    cb(new ApiError('Could not load podcasts successfully', 400), false);
    
  }
  }
  
module.exports = getpodcast