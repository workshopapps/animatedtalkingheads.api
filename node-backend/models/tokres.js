const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
    token: String,
    expires: Date,
    created: { type: Date, default: Date.now },
    revoked: Date,
    replacedByToken: String
});

schema.virtual('isExpired').get(function () {
    return Date.now() >= this.expires;
});

schema.virtual('isActive').get(function () {
    return !this.revoked && !this.isExpired;
});

module.exports = mongoose.model('RefreshToken', schema);

/* const tokenSchema = new Schema({
userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
    },
token: {
    type: String,
    required: true,
},
createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,// this is the expiry time
},
});

module.exports = mongoose.model('Token', tokenSchema); */

