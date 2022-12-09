
const UserAuth = require('../models/UsersAuth');


const jwt = require('jsonwebtoken');

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
const maxAge = 3 * 24 * 60 * 60;
const createToken = (email,id) => {
  return jwt.sign({ email,id }, 'thisShouldBeMovedToDotEnvLater', {
    expiresIn: maxAge,
  });
};

// controller actions
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkIfExists= await UserAuth.findOne({email:req.body.email})
    if (checkIfExists){
      return res.json({message: 'Email already registered, Sign In'})
    }
    const user = await UserAuth.create({ email, password });
    const getUser= await UserAuth.findOne({email:req.body.email})
    
    const token = createToken(email, getUser._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: token });
  } catch (err) {
    if (err.code === 11000) {
    err.message = 'Email already registered, Login';
    // return ;
  }

    res.status(400).json({ error:err.message });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserAuth.login(email, password);
    const token = createToken(email);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: token });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json({ error:err.message });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json({ message: 'successfully logged out' });
};

// module.exports.forgetpassword_post = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await UserAuth.update(
//       { email, password },
//       {
//         $set: { password: password },
//       }
//     );
//     const token = createToken(UserAuth._id);
//     res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
//     res.status(201).json({ user: UserAuth._id });
//   } catch (err) {
//     const errors = handleErrors(err);
//     res.status(400).json({ errors });
//   }
// };
