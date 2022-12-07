const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
require('dotenv').config();
const Schema = mongoose.Schema;

const schema = new Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
  verificationToken: String,
  verified: Date,
  resetToken: {
      token: String,
      expires: Date
  },
  passwordReset: Date,
  created: { type: Date, default: Date.now },
  updated: Date
});

schema.virtual('isVerified').get(function () {
  return !!(this.verified || this.passwordReset);
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
      // remove these props when object is serialized
      delete ret._id;
      delete ret.passwordHash;
  }
});

module.exports = mongoose.model('Account', schema);


/* const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
}, {
  timestamps: true
});


// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  if (!this.isModified("password")){
    return next();
  }else{
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
}
});

// static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

userSchema.method.forgotpassword = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
  }
  throw Error('incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User; */