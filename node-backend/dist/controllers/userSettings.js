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
var UserSettings = require("../models/UserSettings");
// const User = require("../models/User")
var addSettings = function() {
    var _ref = _asyncToGenerator(function(req, res) {
        var checkUser, updatedSettings, settings, error;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        6,
                        ,
                        7
                    ]);
                    req.body.owner = req.decoded.email;
                    return [
                        4,
                        UserSettings.findOne({
                            owner: req.decoded.email
                        })
                    ];
                case 1:
                    checkUser = _state.sent();
                    if (!checkUser) return [
                        3,
                        4
                    ];
                    console.log("user settings already exist, updating...");
                    return [
                        4,
                        UserSettings.findOneAndRemove({
                            email: req.decoded.email
                        })
                    ];
                case 2:
                    _state.sent();
                    return [
                        4,
                        UserSettings.create(req.body)
                    ];
                case 3:
                    updatedSettings = _state.sent();
                    return [
                        2,
                        res.status(201).json(updatedSettings)
                    ];
                case 4:
                    return [
                        4,
                        UserSettings.create(req.body)
                    ];
                case 5:
                    settings = _state.sent();
                    res.status(200).json(settings);
                    return [
                        3,
                        7
                    ];
                case 6:
                    error = _state.sent();
                    console.log(error.message);
                    res.status(400).json({
                        message: error.message
                    });
                    return [
                        3,
                        7
                    ];
                case 7:
                    return [
                        2
                    ];
            }
        });
    });
    return function addSettings(req, res) {
        return _ref.apply(this, arguments);
    };
}();
var getSettings = function() {
    var _ref = _asyncToGenerator(function(req, res) {
        var userSettings, error;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    return [
                        4,
                        UserSettings.findOne({
                            owner: req.decoded.email
                        })
                    ];
                case 1:
                    userSettings = _state.sent();
                    if (!userSettings) {
                        return [
                            2,
                            res.json({
                                message: "user ".concat(req.decoded.email, " has no settings yet")
                            })
                        ];
                    }
                    res.status(200).json(userSettings);
                    return [
                        3,
                        3
                    ];
                case 2:
                    error = _state.sent();
                    console.log(error.message);
                    res.status(400).json({
                        message: error.message
                    });
                    return [
                        3,
                        3
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    });
    return function getSettings(req, res) {
        return _ref.apply(this, arguments);
    };
}();
module.exports = {
    addSettings: addSettings,
    getSettings: getSettings
};
