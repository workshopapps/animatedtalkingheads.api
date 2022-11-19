const User = require('../models/User');

const checkUser = async (req, res, next) => {
  if (req.headers.user_id) {
    const user = await User.findById(req.headers.user_id);
  } else {
    const user = await User.create();
  }
  next();
};

module.exports = checkUser;
