const User = require('../models/User');
const { ObjectId } = require('mongodb');

const checkUser = async (req, res, next) => {
  let user;

  user = await User.findById(new ObjectId(req.headers.user_id));

  if (user) {
    user = await User.findByIdAndUpdate(user._id, {
      last_time_accessed: new Date().toISOString(),
    });
    req.headers.user_id = user._id;
    return next();
  }

  user = await User.create({});
  req.headers.user_id = user._id;

  next();
};

module.exports = checkUser;
