const User = require('../models/User');

const checkUser = async (req, res, next) => {
  const user = await User.findById(req.headers.user_id);
  if (user) {
    next();
  } else {
    const user = await User.create({});
    req.headers.user_id = user._id;
    console.log(req.headers.user_id);
  }
  next();
};

module.exports = checkUser;
