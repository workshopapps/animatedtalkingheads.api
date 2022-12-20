"use strict";
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const res = require("express/lib/response");
const sendResetPasswordMail = async (email, token)=>{
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: 'name <tivicky98@gmail.com>',
            to: email,
            subject: 'For Reset Password',
            html: '<p> Hii ' + email + ', Please copy the link and <a href="http://127.0.0.1:4000/auth/resetPassword?token=' + token + '"> reset your password</a>'
        };
        await transporter.sendMail(mailOptions, (error, info)=>{
            if (error) {
                return res.send("Error in sending mail", error);
            } else {
                res.send('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: "ch"
        });
    }
};
// module.exports.forgetpassword_post = async (req, res) => {
//   console.log('forget password')
// };
// handle errors
const handleErrors = (err)=>{
    console.log(err.message, err.code);
    let errors = {
        email: '',
        password: ''
    };
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
        Object.values(err.errors).forEach(({ properties  })=>{
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};
// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (email)=>{
    return jwt.sign({
        email
    }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
};
/* const createSendToken = (user, statusCode, req, res) => {
    const token = createToken(user._id);

    res.cookie('jwt', token,  {
        expires: new DataTransfer(
            Date.now() + maxAge *24 * 60 * 60  *1000
        ),
        nttponly: true,
        secure: req.secure | req.headers['x-forwarded-proto'] === 'https'
    });
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
}; */ // controller actions
module.exports.signup_post = async (req, res)=>{
    const { email , password  } = req.body;
    try {
        const user = await User.create({
            email,
            password
        });
        await user.save();
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        res.status(201).json({
            user: user._id
        });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({
            errors
        });
    }
};
module.exports.forgotpassword = async (req, res)=>{
    //const { email, password } = req.body;
    const email = req.body.email;
    const user = await User.findOne({
        email: req.body.email
    });
    try {
        if (!user) {
            res.status(200).send({
                success: true,
                msg: 'This email does not exits.'
            });
        } else {
            const resetToken = user.createPasswordResetToken();
            await user.save({
                validateBeforeSave: false
            });
            /* const randomString = randomstring.generate();
        const userData = await User.updateOne({email:email},{$set:{token:randomString}})
        sendResetPasswordMail(user.email, randomString);
        res.status(200).send({success:true, msg:"Please check your inbox of mail and reset your password."}) */ const resetURL = `${req.protocol}://${req.get('host')}/rauth/resetpassword/${resetToken}`;
            await new Email(user, resetURL).sendPasswordReset();
            //console.log(user.password);
            res.status(200).json({
                status: 'success',
                message: 'Token sent to email!'
            });
        }
    /*    const user = await User.update({ email, password }, {
   $set: { password: password}
  });
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id }); */ } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({
            errors
        });
    }
};
module.exports.resetpassword = async (req, res)=>{
    try {
        // 1) Get user based on the token
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        //console.log(user, passwordResetToken, hashedToken);
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {
                $gt: Date.now()
            }
        });
        // 2) If token has not expired, and there is user, set the new password
        if (!user) {
            res.status(400).send({
                success: false,
                msg: 'Invalid token.'
            });
        } else {
            user.password = req.body.password;
            //user.passwordConfirm = req.body.passwordConfirm;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            const token = createToken(user._id);
            //res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(200).json({
                user: token
            });
        //console.log(user.password);
        }
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: error.message
        });
    }
};
