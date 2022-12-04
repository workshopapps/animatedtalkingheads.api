const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const { stringify } = require('querystring');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
<<<<<<< HEAD

  //passwordResetToken: String,
  //passwordResetExpires: Date,
=======
  token: {
    type: String,
    default: ''
  }
>>>>>>> 9a4081417bb61a32802d541863c5dda33104e3d3
});



// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
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

userSchema.method.forgetpassword = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
  }
  throw Error('incorrect email');
}
//might clear if the forgot password works
/* userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

<<<<<<< HEAD
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    console.log({resetToken}, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;

  //crypto.createHash('sha256').update(resetToken).digest('hex');
}; */
=======

>>>>>>> 9a4081417bb61a32802d541863c5dda33104e3d3
const User = mongoose.model('user', userSchema);

module.exports = User;