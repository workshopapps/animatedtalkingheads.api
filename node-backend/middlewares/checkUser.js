const User = require('../models/User');
const { ObjectId } = require('mongodb');

const checkUser = async (req, res, next) => {
  let user;

  user = await User.findById(req.headers.user_id);

  console.log(req.headers.user_id, user);
  if (user) {
    req.headers.user_id = user._id;
    return next();
  }

  user = await User.create({});
  req.headers.user_id = user._id;

  next();
};

module.exports = checkUser;
