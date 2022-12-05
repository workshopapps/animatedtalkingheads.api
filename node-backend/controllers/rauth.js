const User = require("../models/UsersAuth");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const res = require("express/lib/response")

const sendResetPasswordMail = async(email, token) => {

  try {
    const transporter = nodemailer.createTransport({  
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "385347a8cac45c",
            pass: "318b8146500b7e"
        }
    });
    const mailOptions = {
      from: 'name <tivicky98@gmail.com>',
      to: email,
      subject: 'For Reset Password',
      html:'<p> Hii '+email+', Please copy the link and <a href="http://127.0.0.1:4000/auth/resetPassword?token='+token+'"> reset your password</a>'
    }
    await transporter.sendMail(mailOptions, (error, info)=> {
      if(error){
        return console.log("Error in sending mail", error)
      }
      else{
          console.log('Email sent: ' + info.response)
      } 
  });
    } catch (error) {
      res.status(400).send({success:false,msg:"ch"});
    }

}
// module.exports.forgetpassword_post = async (req, res) => {
//   console.log('forget password')
// };
// handle errors
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
}

// controller actions
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.create({ email, password });
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id });
    }
    catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
   
  }
  module.exports.forgotpassword = async (req, res) => {

    //const { email, password } = req.body;
    try {
      const email = req.body.email;
      const user = await User.findOne({email:req.body.email});
  
      if(user){
        const randomString = randomstring.generate();
        const userData = await User.updateOne({email:email},{$set:{token:randomString}})
        sendResetPasswordMail(user.email, randomString);
        res.status(200).send({success:true, msg:"Please check your inbox of mail and reset your password."})
      }
      else{
        res.status(200).send({success:true, msg:"This email does not exits."})
      }
   /*    const user = await User.update({ email, password }, {
   $set: { password: password}
  });
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id }); */
    }
    catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  }
module.exports.resetpassword = async(req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await User.findOne({ token:token});
        if(tokenData){
          const password = req.body.password;
          const newPassword = await securePassword(password);
          const userData = await User.findByIdAndUpdate({ _id:tokenData._id }, {$set:{password:newPassword, token:''}}, {new:true})
          res.status(200).send({success:true, msg:"User Password has been reset.", data:userData})
        }
        else{
          res.status(200).send({success:true, msg:"This link has expired."})
        }
    }catch (error) {
      res.status(200).send({success:false, msg:error.message});
    }
}

