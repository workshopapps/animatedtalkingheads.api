const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log(req.headers.authorization);
    // console.log('auth start');
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
      return res
        .status(401)
        .json({ message: 'Unauthorized!! supply Bearer token' });
    }
    const token = authorization.split(' ')[1];
    // console.log(token);

    const payload = jwt.verify(token, 'thisShouldBeMovedToDotEnvLater');
    // console.log(payload);
    const userId = await User.findOne({ email: payload.email });
    req.headers.user_id = userId.id;
    req.decoded = { email: payload.email, id: payload.id };
    // console.log('auth end, calling next...');
    next();
  } catch (error) {
    const { message } = error;
    res.status(401).json({ message });
    console.log(message);
  }
};

module.exports = auth;
