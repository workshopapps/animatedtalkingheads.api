const UserSettings = require("../models/UserSettings");
// const User = require("../models/UserAuth")
const addSettings = async (req, res) => {
  try {
    console.log(req.decoded.id)
    req.body.owner = req.decoded.email;
    const settings = await UserSettings.create(req.body)
    res.status(200).json(settings);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({message:error.message});
  }
};

module.exports = {addSettings}