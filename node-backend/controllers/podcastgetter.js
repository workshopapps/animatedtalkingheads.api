const Podcast = require('./../models/Podcast'); 
 
const getpodcast = async (req, res,next) => {
  try{
    let podcast = await Podcast.find({user_id:req.headers.user_id})
    if(podcast<1){
      return res.status(404).json({message:"podcasts not available for user"})
    }
    res.status(200).json(podcast);
   }
  catch(err){ 
    cb(new ApiError('Could not load podcasts successfully', 400), false);  
      } 
   }
  
module.exports = getpodcast 