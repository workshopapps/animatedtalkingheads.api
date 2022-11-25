const Avatars = require('../models/Avatar')
const ClothType = require('../models/ClothType')
const HairType = require('../models/HairType')
const SkinType = require('../models/SkinType')
const PodcastSchema = require('../models/Podcast')
const UserSchema = require('../models/User')


const addAvatar = async (req, res) => {
  //get user_id from request body
  const {user_id}= req.body
  try {
    //find podcast that has same user_id
    const podcast = await PodcastSchema.findOne({user_id})
    //append the id of podcast on the req.body
    if(!podcast){
      return res.status(404).json({
        message:`no podcast with user id ${user_id}`
      })
    }
    req.body.podcast_id=podcast._id
    const newAvatar = await Avatars.create(req.body);
    res.status(201).json(newAvatar);
  } catch (error) {
    console.log(error);
    res.status(500).json({error:error});
  }
};
const addCloth = async(req,res)=>{
  try {
    const newCloth = await ClothType.create(req.body);
    res.status(201).json(newCloth);
  } catch (error) {
    console.log(error);
    res.status(500).json({error:error});
  }  
}
const addHair = async(req,res)=>{
  try {
    const newHair = await HairType.create(req.body);
    res.status(201).json(newHair);
  } catch (error) {
    console.log(error);
    res.status(500).json({error:error});
  }  
}
const addSkin = async(req,res)=>{
  try {
    const newSkin = await SkinType.create(req.body);
    res.status(201).json(newSkin);
  } catch (error) {
    console.log(error);
    res.status(500).json({error:error});
  }  
}



module.exports={addAvatar, addCloth, addHair, addSkin}