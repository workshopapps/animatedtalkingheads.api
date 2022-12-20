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
var AnimatedVideo = require("../models/AnimatedVideo");
var NotFound = require("../utils/errors/NotFound");
var fs = require("fs");
var path = require("path");
exports.getOneAnimatedVideo = function() {
    var _ref = _asyncToGenerator(function(req, res, next) {
        var animatedVideoDoc, err;
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
                        AnimatedVideo.findOne({
                            user_id: req.headers.user_id,
                            // to use this later after phasing out user_id
                            // owner:req.decoded.email
                            _id: req.params.animatedVideoId
                        })
                    ];
                case 1:
                    animatedVideoDoc = _state.sent();
                    if (!animatedVideoDoc) {
                        return [
                            2,
                            next(new NotFound())
                        ];
                    }
                    res.json(animatedVideoDoc);
                    return [
                        3,
                        3
                    ];
                case 2:
                    err = _state.sent();
                    next(err);
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
    return function(req, res, next) {
        return _ref.apply(this, arguments);
    };
}();
exports.getAllUserCreatedAnimatedVideos = function() {
    var _ref = _asyncToGenerator(function(req, res, next) {
        var status, page, limit, skip, query, animatedVideoDocs, err;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    status = req.query.status;
                    page = Number(req.query.page) || 1;
                    limit = Number(req.query.limit) || 20;
                    skip = (page - 1) * limit;
                    query = {
                        user_id: req.header.user_id
                    };
                    status && (query["status"] = status);
                    return [
                        4,
                        AnimatedVideo.find(query).limit(limit).skip(skip)
                    ];
                case 1:
                    animatedVideoDocs = _state.sent();
                    if (!animatedVideoDocs.length) {
                        return [
                            2,
                            next(new NotFound())
                        ];
                    }
                    res.json("animatedVideoDocs");
                    return [
                        3,
                        3
                    ];
                case 2:
                    err = _state.sent();
                    console.log("err");
                    next(err);
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
    return function(req, res, next) {
        return _ref.apply(this, arguments);
    };
}();
exports.deleteAnimatedVideo = function() {
    var _ref = _asyncToGenerator(function(req, res, next) {
        var animatedVideoDoc, animatedVideoFolder, err;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        3,
                        ,
                        4
                    ]);
                    return [
                        4,
                        AnimatedVideo.findOne({
                            _id: req.params.animatedVideoId,
                            user_id: req.headers.user_id
                        })
                    ];
                case 1:
                    animatedVideoDoc = _state.sent();
                    if (!animatedVideoDoc) next(new NotFound());
                    animatedVideoFolder = path.resolve(process.cwd() + "/" + "/pyhton-backend/data/user_data/".concat(animatedVideoDoc.id));
                    fs.rmdir(animatedVideoFolder, {
                        recursive: true,
                        force: true
                    }, function(err) {
                        throw err;
                    });
                    return [
                        4,
                        animatedVideoDoc.remove()
                    ];
                case 2:
                    _state.sent();
                    res.status(204).send();
                    return [
                        3,
                        4
                    ];
                case 3:
                    err = _state.sent();
                    console.error(err);
                    next(err);
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
    return function(req, res, next) {
        return _ref.apply(this, arguments);
    };
}();
