const Podcast = require('./../models/Podcast');


exports.getpodcast = async (req, res,next) => {
  try{
    let podcast = await Podcast.find({user_id:req.userId})
    res.send(podcast);
  }

  catch(error){
    next(error)
  }
  }
  