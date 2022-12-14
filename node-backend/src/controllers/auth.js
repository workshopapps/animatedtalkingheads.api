const User = require('../models/User');
const { writeFile } = require('fs/promises');
const fs = require('fs');
const process = require('process');
const jwt = require('jsonwebtoken');
const InvalidFile = require('../utils/errors/InvalidFile');
const ApiError = require('../utils/errors/ApiError');
const path = require('path');

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
// create json web token
const maxAge = 20 * 24 * 60 * 60;
const createToken = (email, id) => {
  return jwt.sign({ email, id }, 'thisShouldBeMovedToDotEnvLater', {
    expiresIn: maxAge,
  });
};

// controller actions
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    if (err.code === 11000) {
      err.message = 'Email already registered, Login';
      // return ;
    }

    res.status(400).json({ error: err.message });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(email);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: token });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json({ error: err.message });
  }
};

module.exports.updateUserProfile = async (req, res, next) => {
  if (!req.file) {
    return next(new InvalidFile());
  }
  const user_file_path = ('/profile_pic' + '/').replaceAll(' ', '');

  let save_file_directory =
    user_file_path +
    req.headers.user_id +
    '.' +
    req.file.mimetype.split('/')[1];
  try {
    await writeFile(
      path.resolve(process.cwd() + '/uploads/' + save_file_directory),
      req.file.buffer
    );

    let user = await User.findOneAndUpdate(
      { id: req.headers.user_id },
      { profile_pic: save_file_directory }
    );

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);

    return next(
      new ApiError('Profile picture wasnt uploaded successfully', 400),
      false
    );
  }
};
module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json({ message: 'successfully logged out' });
};

// module.exports.forgetpassword_post = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.update(
//       { email, password },
//       {
//         $set: { password: password },
//       }
//     );
//     const token = createToken(User._id);
//     res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
//     res.status(201).json({ user: User._id });
//   } catch (err) {
//     const errors = handleErrors(err);
//     res.status(400).json({ errors });
//   }
// };
