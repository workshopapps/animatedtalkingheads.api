const UserSettings = require("../models/UserSettings");
// const User = require("../models/UserAuth")
const addSettings = async (req, res) => {
  try {
    req.body.owner = req.decoded.email;
    //check if user has a saved setting
    const checkUser = await UserSettings.findOne({owner:req.decoded.email})
    // if user settings already exist replace
    if(checkUser){
        console.log('user settings already exist, updating...');
         await UserSettings.findOneAndRemove({email:req.decoded.email})
         const updatedSettings =await UserSettings.create(req.body)
         return res.status(201).json(updatedSettings)
    }
    const settings = await UserSettings.create(req.body)
    res.status(200).json(settings);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({message:error.message});
  }
};

const getSettings =async (req,res)=>{
     try {
   
    const userSettings = await UserSettings.findOne({owner:req.decoded.email})
    if(!userSettings){
        return res.json({message:`user ${req.decoded.email} has no settings yet`})
    }
    res.status(200).json(userSettings);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({message:error.message});
  } 
}

module.exports = {addSettings, getSettings}