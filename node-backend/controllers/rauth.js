const express = require('express');
const Joi = require('joi');
const User = require("../models/UsersAuth");
const Token = require("../models/tokres");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
//const randomstring = require("randomstring");
const res = require("express/lib/response");
require('dotenv').config();
const bcrypt = require("bcrypt");
const crypto = require("crypto")
//const jwt2 = require('jwt-simple');
//const validateRequest = require('_middleware/validate-request');
//const authorize = require('_middleware/authorize')
const accountService = require('../jobs/service');



function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}
function authenticate(req, res, next) {
    const { email, password } = req.body;
    accountService.authenticate({ email, password })
        .then(({ refreshToken, ...account }) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}

function refreshToken(req, res, next) {
    const token = req.cookies.refreshToken;
    accountService.refreshToken({ token })
        .then(({ refreshToken, ...account }) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}

function revokeTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}


function registerSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    accountService.register(req.body, req.get('origin'))
        .then(() => res.json({ message: 'Registration successful, please check your email for verification instructions' }))
        .catch(next);
}

function forgotPasswordSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });
    validateRequest(req, next, schema);
}

function forgotPassword(req, res, next) {
    accountService.forgotPassword(req.body, req.get('origin'))
        .then(() => res.json({ message: 'Please check your email for password reset instructions' }))
        .catch(next);
}

function validateResetTokenSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function validateResetToken(req, res, next) {
    accountService.validateResetToken(req.body)
        .then(() => res.json({ message: 'Token is valid' }))
        .catch(next);
}

function resetPasswordSchema(req, res, next) {
    const schema = Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });
    validateRequest(req, next, schema);
}


function resetPassword(req, res, next) {
    accountService.resetPassword(req.body)
        .then(() => res.json({ message: 'Password reset successful, you can now login' }))
        .catch(next);
}

function getAll(req, res, next) {
    accountService.getAll()
        .then(accounts => res.json(accounts))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    accountService.create(req.body)
        .then(account => res.json(account))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schemaRules = {
        email: Joi.string().email().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
    };
    const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    // users can update their own account and admins can update any account
    if (req.params.id !== req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    accountService.update(req.params.id, req.body)
        .then(account => res.json(account))
        .catch(next);
}

function setTokenCookie(res, token) {
    // create cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}
/* const sendResetPasswordMail = async(email, token) => {

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
      html:'<p> Hii '+email+', Please copy the link and <a href="http://127.0.0.1:4000/auth/resetPassword?token=' + payload.id + '/' + token +'"> reset your password</a>'
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


// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};


// controller actions
module.exports.signup = async (req, res) => {
    const { email, password } = req.body;
  
    try {
    const email = req.body.email;
    const user = await User.findOne({email:req.body.email});
    if (user) {
        res.status(200).send({success:true, msg:"The user already exist"});
    }else{
      const user = await User.create({ email, password });
      const token = createToken({id:user._id});
      user.token = token
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user});
    }
}
    catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
   
  }
  /*  module.exports.forgotpassword = async (req, res) => {

    //const { email, password } = req.body;
    try {
        const email = req.body.email;
        const user = await User.findOne({email:req.body.email});
        if(user){
            
            const udate = undefined;

            const date = udate || new Date();
            payload = (user.email, user._id)


            const secret = user.password + '-' + date.getTime();
            const rtoken = jwt2.encode(payload, secret);
            sendResetPasswordMail(user.email, rtoken)
            res.status(200).send({success:true, msg:"Please check your inbox of mail and reset your password."})
        }
        else{
            res.status(200).send({success:true, msg:"This email does not exits."})
            }

        } */
      
   
   /*     if(user){
        const randomString = randomstring.generate();
        const userData = await User.updateOne({email:email},{$set:{token:randomString}})
        sendResetPasswordMail(user.email, randomString);
        res.status(200).send({success:true, msg:"Please check your inbox of mail and reset your password."})
      }
      else{
        res.status(200).send({success:true, msg:"This email does not exits."})
      } 
       const user = await User.update({ email, password }, {
   $set: { password: password}
  }); */
/*       const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id }); 
     } */
/* module.exports.forgotpassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email });
        console.log(email);
        if (!user) {
           throw new Error("User does not exist");
        }    */
       /*else{
        //let resetToken = crypto.randomBytes(32).toString("hex");
        
      /*    if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save(); */
            //console.log(token) 
            //await token.deleteOne()
       // }; 
        //const token = createToken({id:user._id});
       /*  res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({user, token});
    }
    catch (err) {
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
} */

