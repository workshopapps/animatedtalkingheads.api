"use strict";
const mongoose = require('mongoose');
const UserSettings = new mongoose.Schema({
    owner: {
        type: String
    },
    youtube: {
        type: Boolean,
        default: false
    },
    twitter: {
        type: Boolean,
        default: false
    },
    facebook: {
        type: Boolean,
        default: false
    },
    googleDrive: {
        type: Boolean,
        default: false
    },
    oneDrive: {
        type: Boolean,
        default: false
    },
    dropBox: {
        type: Boolean,
        default: false
    },
    instagram: {
        type: Boolean,
        default: false
    },
    linkedIn: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model("userSettings", UserSettings);
