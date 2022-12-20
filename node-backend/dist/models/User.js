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
var mongoose = require("mongoose");
var isEmail = require("validator").isEmail;
var bcrypt = require("bcrypt");
var crypto = require("crypto");
var stringify = require("querystring").stringify;
var Schema = mongoose.Schema;
var userSchema = new Schema({
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
    email: {
        type: String,
        required: [
            true,
            "Please enter an email"
        ],
        unique: true,
        lowercase: true,
        validate: [
            isEmail,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [
            true,
            "Please enter a password"
        ],
        minlength: [
            6,
            "Minimum password length is 6 characters"
        ]
    },
    //passwordResetToken: String,
    //passwordResetExpires: Date,
    token: {
        type: String,
        default: ""
    }
});
// fire a function before doc saved to db
userSchema.pre("save", function() {
    var _ref = _asyncToGenerator(function(next1) {
        var salt, _;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        bcrypt.genSalt()
                    ];
                case 1:
                    salt = _state.sent();
                    _ = this;
                    return [
                        4,
                        bcrypt.hash(this.password, salt)
                    ];
                case 2:
                    _.password = _state.sent();
                    next1();
                    return [
                        2
                    ];
            }
        });
    });
    return function(next1) {
        return _ref.apply(this, arguments);
    };
}());
// static method to login user
userSchema.statics.login = function() {
    var _ref = _asyncToGenerator(function(email, password) {
        var user, auth;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        this.findOne({
                            email: email
                        })
                    ];
                case 1:
                    user = _state.sent();
                    if (!user) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        bcrypt.compare(password, user.password)
                    ];
                case 2:
                    auth = _state.sent();
                    if (auth) {
                        return [
                            2,
                            user
                        ];
                    }
                    throw Error("Invalid Credentials");
                case 3:
                    throw Error("Invalid Credentials");
            }
        });
    });
    return function(email, password) {
        return _ref.apply(this, arguments);
    };
}();
userSchema.method.forgetpassword = function() {
    var _ref = _asyncToGenerator(function(email, password) {
        var user, salt, _;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        this.findOne({
                            email: email
                        })
                    ];
                case 1:
                    user = _state.sent();
                    if (!user) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        bcrypt.genSalt()
                    ];
                case 2:
                    salt = _state.sent();
                    _ = this;
                    return [
                        4,
                        bcrypt.hash(this.password, salt)
                    ];
                case 3:
                    _.password = _state.sent();
                    next();
                    _state.label = 4;
                case 4:
                    throw Error("incorrect email");
            }
        });
    });
    return function(email, password) {
        return _ref.apply(this, arguments);
    };
}();
userSchema.methods.createPasswordResetToken = function() {
    var resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    console.log({
        resetToken: resetToken
    }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
var User = mongoose.model("User", userSchema);
module.exports = User;
