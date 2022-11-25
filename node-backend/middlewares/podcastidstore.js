//store podcast id
const getId = (req,res,next)=>{
    req.podcastId = req.params.podcastid;
    next()
  }

  module.exports = getId;
