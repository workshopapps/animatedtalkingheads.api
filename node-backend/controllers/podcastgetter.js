const Podcast = require('./../models/Podcast');


const getpodcast = async (req, res,next) => {
  try{
    let podcast = await Podcast.find({user_id:req.userId})
    res.send(podcast);
  }

  catch(error){
    next(error)
  }
  }
  
module.exports = getpodcast