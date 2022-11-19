const User = require('../models/User');

const checkUser = async (req, res, next) => {
  if (req.headers.user_id) {
    const user = await User.findById(req.headers.user_id);
    console.log(user);
  } else {
    const user = await User.create();
    console.log(user);
  }
  next();
};

module.exports = checkUser;
