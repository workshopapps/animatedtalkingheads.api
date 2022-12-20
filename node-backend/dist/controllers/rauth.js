function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
var __generator = this && this.__generator || function(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return(g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g);
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var User = require("../models/User");
var jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
//const randomstring = require("randomstring");
//const res = require("express/lib/response");
var Email = require("../utils/email");
var crypto = require("crypto");
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

} */ // module.exports.forgetpassword_post = async (req, res) => {
//   console.log('forget password')
// };
// handle errors
var handleErrors = function(err) {
    console.log(err.message, err.code);
    var errors = {
        email: "",
        password: ""
    };
    // incorrect email
    if (err.message === "incorrect email") {
        errors.email = "That email is not registered";
    }
    // incorrect password
    if (err.message === "incorrect password") {
        errors.password = "That password is incorrect";
    }
    // duplicate email error
    if (err.code === 11000) {
        errors.email = "that email is already registered";
        return errors;
    }
    // validation errors
    if (err.message.includes("user validation failed")) {
        // console.log(err);
        Object.values(err.errors).forEach(function(param) {
            var properties = param.properties;
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};
// create json web token
var maxAge = 3 * 24 * 60 * 60;
var createToken = function(email) {
    return jwt.sign({
        email: email
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
     // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
}; */ // controller actions
module.exports.signup_post = function() {
    var _ref = _asyncToGenerator(function(req, res) {
        var _req_body, email, password, user, token, err, errors;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _req_body = req.body, email = _req_body.email, password = _req_body.password;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        4,
                        ,
                        5
                    ]);
                    return [
                        4,
                        User.create({
                            email: email,
                            password: password
                        })
                    ];
                case 2:
                    user = _state.sent();
                    return [
                        4,
                        user.save()
                    ];
                case 3:
                    _state.sent();
                    token = createToken(user._id);
                    res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000
                    });
                    res.status(201).json({
                        user: user._id
                    });
                    return [
                        3,
                        5
                    ];
                case 4:
                    err = _state.sent();
                    errors = handleErrors(err);
                    res.status(400).json({
                        errors: errors
                    });
                    return [
                        3,
                        5
                    ];
                case 5:
                    return [
                        2
                    ];
            }
        });
    });
    return function(req, res) {
        return _ref.apply(this, arguments);
    };
}();
module.exports.forgotpassword = function() {
    var _ref = _asyncToGenerator(function(req, res) {
        var email, user, resetToken, resetURL, err, errors;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    email = req.body.email;
                    return [
                        4,
                        User.findOne({
                            email: req.body.email
                        })
                    ];
                case 1:
                    user = _state.sent();
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        7,
                        ,
                        8
                    ]);
                    if (!!user) return [
                        3,
                        3
                    ];
                    res.status(200).send({
                        success: true,
                        msg: "This email does not exits."
                    });
                    return [
                        3,
                        6
                    ];
                case 3:
                    resetToken = user.createPasswordResetToken();
                    return [
                        4,
                        user.save({
                            validateBeforeSave: false
                        })
                    ];
                case 4:
                    _state.sent();
                    resetURL = "".concat(req.protocol, "://").concat(req.get("host"), "/rauth/resetpassword/").concat(resetToken);
                    return [
                        4,
                        new Email(user, resetURL).sendPasswordReset()
                    ];
                case 5:
                    _state.sent();
                    //console.log(user.password);
                    res.status(200).json({
                        status: "success",
                        message: "Token sent to email!"
                    });
                    _state.label = 6;
                case 6:
                    return [
                        3,
                        8
                    ];
                case 7:
                    err = _state.sent();
                    errors = handleErrors(err);
                    res.status(400).json({
                        errors: errors
                    });
                    return [
                        3,
                        8
                    ];
                case 8:
                    return [
                        2
                    ];
            }
        });
    });
    return function(req, res) {
        return _ref.apply(this, arguments);
    };
}();
module.exports.resetpassword = function() {
    var _ref = _asyncToGenerator(function(req, res) {
        var hashedToken, user, token, error;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        5,
                        ,
                        6
                    ]);
                    hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
                    return [
                        4,
                        User.findOne({
                            passwordResetToken: hashedToken,
                            passwordResetExpires: {
                                $gt: Date.now()
                            }
                        })
                    ];
                case 1:
                    user = _state.sent();
                    if (!!user) return [
                        3,
                        2
                    ];
                    res.status(400).send({
                        success: false,
                        msg: "Invalid token."
                    });
                    return [
                        3,
                        4
                    ];
                case 2:
                    user.password = req.body.password;
                    //user.passwordConfirm = req.body.passwordConfirm;
                    user.passwordResetToken = undefined;
                    user.passwordResetExpires = undefined;
                    return [
                        4,
                        user.save()
                    ];
                case 3:
                    _state.sent();
                    token = createToken(user._id);
                    //res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                    res.status(200).json({
                        user: token
                    });
                    _state.label = 4;
                case 4:
                    return [
                        3,
                        6
                    ];
                case 5:
                    error = _state.sent();
                    res.status(400).send({
                        success: false,
                        msg: error.message
                    });
                    return [
                        3,
                        6
                    ];
                case 6:
                    return [
                        2
                    ];
            }
        });
    });
    return function(req, res) {
        return _ref.apply(this, arguments);
    };
}();
