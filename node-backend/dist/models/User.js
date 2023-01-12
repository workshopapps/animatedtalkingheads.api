"use strict";
const mongoose = require('mongoose');
const { isEmail  } = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { stringify  } = require('querystring');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String
    },
    last_time_accessed: {
        type: Date,
        default: Date.now()
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profile_pic: {
        type: String
    },
    email: {
        type: String,
        required: [
            true,
            'Please enter an email'
        ],
        unique: true,
        lowercase: true,
        validate: [
            isEmail,
            'Please enter a valid email'
        ]
    },
    password: {
        type: String,
        required: [
            true,
            'Please enter a password'
        ],
        minlength: [
            6,
            'Minimum password length is 6 characters'
        ]
    },
    //passwordResetToken: String,
    //passwordResetExpires: Date,
    token: {
        type: String,
        default: ''
    }
});
// fire a function before doc saved to db
userSchema.pre('save', async function(next1) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next1();
});
// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({
        email
    });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Invalid Credentials');
    }
    throw Error('Invalid Credentials');
};
userSchema.method.forgetpassword = async function(email, password) {
    const user = await this.findOne({
        email
    });
    if (user) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    throw Error('incorrect email');
};
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({
        resetToken
    }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
