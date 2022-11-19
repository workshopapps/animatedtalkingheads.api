//store podcast id
export const getId = (req,res,next)=>{
    req.podcastId = req.params.podcastid;
    next()
  }