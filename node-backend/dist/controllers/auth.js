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
var createToken = function(email, id) {
    return jwt.sign({
        email: email,
        id: id
    }, "thisShouldBeMovedToDotEnvLater", {
        expiresIn: maxAge
    });
};
// controller actions
module.exports.signup_post = function() {
    var _ref = _asyncToGenerator(function(req, res) {
        var _req_body, email, password, checkIfExists, user, getUser, token, err;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _req_body = req.body, email = _req_body.email, password = _req_body.password;
                    console.log(req.body);
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        5,
                        ,
                        6
                    ]);
                    return [
                        4,
                        User.findOne({
                            email: req.body.email
                        })
                    ];
                case 2:
                    checkIfExists = _state.sent();
                    if (checkIfExists) {
                        return [
                            2,
                            res.json({
                                message: "Email already registered, Sign In"
                            })
                        ];
                    }
                    return [
                        4,
                        User.create({
                            email: email,
                            password: password
                        })
                    ];
                case 3:
                    user = _state.sent();
                    return [
                        4,
                        User.findOne({
                            email: req.body.email
                        })
                    ];
                case 4:
                    getUser = _state.sent();
                    token = createToken(email, getUser._id);
                    res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000
                    });
                    res.status(201).json({
                        user: token
                    });
                    return [
                        3,
                        6
                    ];
                case 5:
                    err = _state.sent();
                    if (err.code === 11000) {
                        err.message = "Email already registered, Login";
                    // return ;
                    }
                    res.status(400).json({
                        error: err.message
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
module.exports.login_post = function() {
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
                        3,
                        ,
                        4
                    ]);
                    return [
                        4,
                        User.login(email, password)
                    ];
                case 2:
                    user = _state.sent();
                    token = createToken(email);
                    res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000
                    });
                    res.status(200).json({
                        user: token
                    });
                    return [
                        3,
                        4
                    ];
                case 3:
                    err = _state.sent();
                    console.log(err);
                    errors = handleErrors(err);
                    res.status(400).json({
                        error: err.message
                    });
                    return [
                        3,
                        4
                    ];
                case 4:
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
module.exports.logout_get = function(req, res) {
    res.cookie("jwt", "", {
        maxAge: 1
    });
    res.status(200).json({
        message: "successfully logged out"
    });
}; // module.exports.forgetpassword_post = async (req, res) => {
 //   const { email, password } = req.body;
 //   try {
 //     const user = await User.update(
 //       { email, password },
 //       {
 //         $set: { password: password },
 //       }
 //     );
 //     const token = createToken(User._id);
 //     res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
 //     res.status(201).json({ user: User._id });
 //   } catch (err) {
 //     const errors = handleErrors(err);
 //     res.status(400).json({ errors });
 //   }
 // };
