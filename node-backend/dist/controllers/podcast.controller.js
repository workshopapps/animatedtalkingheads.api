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
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
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
var fs = require("fs");
var path = require("path");
var _require = require("fs/promises"), writeFile = _require.writeFile, readFile = _require.readFile;
var Podcast = require("./../models/Podcast");
var ApiError = require("../utils/errors/ApiError");
var NotFound = require("../utils/errors/NotFound");
var runPythonScript = require("./run-python");
var AnimatedVideo = require("../models/AnimatedVideo");
var User = require("../models/User");
exports.generateAnimatedVideos = function() {
    var _ref = _asyncToGenerator(function(req, res, next) {
        var fetchedUser, animatedVideoDoc, podcastDoc, metaJson, metaJsonFilePath, animatedVideoFolderPath, metaJsonFile, jobConfig;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        User.findOne({
                            email: req.decoded.email
                        })
                    ];
                case 1:
                    fetchedUser = _state.sent();
                    return [
                        4,
                        AnimatedVideo.findById(req.headers.animated_video_id)
                    ];
                case 2:
                    animatedVideoDoc = _state.sent();
                    if (!!animatedVideoDoc) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        AnimatedVideo.create({
                            podcast_id: req.params.podcastId,
                            user_id: fetchedUser._id
                        })
                    ];
                case 3:
                    animatedVideoDoc = _state.sent();
                    _state.label = 4;
                case 4:
                    return [
                        4,
                        Podcast.findById(req.params.podcastId)
                    ];
                case 5:
                    podcastDoc = _state.sent();
                    metaJson = {
                        audio_path: podcastDoc.file_path,
                        audio_url: podcastDoc.file_url,
                        avatar_map: req.body.avatar_map,
                        bg_path: req.body.bg_path,
                        dir_id: animatedVideoDoc.id
                    };
                    metaJsonFilePath = path.resolve(path.dirname(process.cwd() + "/") + "/pyhton-backend/test_data/".concat(animatedVideoDoc._id, ".json"));
                    animatedVideoFolderPath = path.resolve(path.dirname(process.cwd() + "/") + "/pyhton-backend/data/user_data/".concat(animatedVideoDoc._id));
                    return [
                        4,
                        writeFile(metaJsonFilePath, JSON.stringify(metaJson), "utf-8")
                    ];
                case 6:
                    metaJsonFile = _state.sent();
                    jobConfig = _objectSpreadProps(_objectSpread({}, metaJson), {
                        user_id: req.headers.userid,
                        animated_video_id: animatedVideoDoc.id,
                        meta_json_file: metaJsonFilePath,
                        animatedVideoFolderPath: animatedVideoFolderPath,
                        reqHost: req.protocol + "://" + req.get("host")
                    });
                    return [
                        4,
                        runPythonScript(jobConfig)
                    ];
                case 7:
                    _state.sent();
                    res.json(animatedVideoDoc);
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
exports.podcastuploader = function() {
    var _ref = _asyncToGenerator(function(req, res, next) {
        var user_file_path, fileExt, save_file_directory, fetchedUser, podcast, err;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    user_file_path = ("/uploads/podcasts/" + req.headers.user_id + "/").replaceAll(" ", "");
                    fileExt = req.file.originalname ? req.file.originalname : req.file.ext;
                    save_file_directory = user_file_path + req.headers.user_id + "-" + Date.now() + fileExt;
                    save_file_directory = save_file_directory.replaceAll(" ", "");
                    return [
                        4,
                        User.findById(req.headers.user_id)
                    ];
                case 1:
                    fetchedUser = _state.sent();
                    return [
                        4,
                        Podcast.create({
                            user_id: fetchedUser._id,
                            file_name: req.body.file_name,
                            file_url: req.protocol + "://" + req.get("host") + save_file_directory,
                            file_path: path.resolve(process.cwd(), "." + save_file_directory)
                        })
                    ];
                case 2:
                    podcast = _state.sent();
                    if (!fs.existsSync("." + user_file_path)) {
                        fs.mkdirSync("." + user_file_path);
                    }
                    _state.label = 3;
                case 3:
                    _state.trys.push([
                        3,
                        5,
                        ,
                        7
                    ]);
                    return [
                        4,
                        writeFile("." + save_file_directory, req.file.buffer)
                    ];
                case 4:
                    _state.sent();
                    return [
                        3,
                        7
                    ];
                case 5:
                    err = _state.sent();
                    return [
                        4,
                        Podcast.findOneAndDelete({
                            id: podcast._id,
                            user_id: req.fetchedUser._id
                        })
                    ];
                case 6:
                    podcast = _state.sent();
                    console.error(err);
                    return [
                        2,
                        next(new ApiError("Podcast wasnt uploaded successfully", 400), false)
                    ];
                case 7:
                    res.send(podcast);
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
exports.getOnePodcast = function() {
    var _ref = _asyncToGenerator(function(req, res, next) {
        var fetchedUser, podcast, err;
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
                        User.findOne({
                            email: req.decoded.email
                        })
                    ];
                case 1:
                    fetchedUser = _state.sent();
                    return [
                        4,
                        Podcast.findOne({
                            _id: req.params.podcastId,
                            user_id: fetchedUser._id
                        })
                    ];
                case 2:
                    podcast = _state.sent();
                    if (!podcast) {
                        return [
                            2,
                            next(new NotFound())
                        ];
                    }
                    res.json(podcast);
                    return [
                        3,
                        4
                    ];
                case 3:
                    err = _state.sent();
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
exports.getAllUserUploadedPodcast = function() {
    var _ref = _asyncToGenerator(function(req, res, next) {
        var page, limit, skip, fetchedUser, podcasts, err;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        3,
                        ,
                        4
                    ]);
                    page = Number(req.query.page) || 1;
                    limit = Number(req.query.page) || 20;
                    skip = (page - 1) * limit;
                    return [
                        4,
                        User.findOne({
                            email: req.decoded.email
                        })
                    ];
                case 1:
                    fetchedUser = _state.sent();
                    return [
                        4,
                        Podcast.find({
                            user_id: fetchedUser._id
                        }).limit(limit).skip(skip)
                    ];
                case 2:
                    podcasts = _state.sent();
                    // if (podcast.length < ) {
                    //   next(new NotFound());
                    // }
                    res.json(podcasts);
                    return [
                        3,
                        4
                    ];
                case 3:
                    err = _state.sent();
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
exports.deletePodcast = function() {
    var _ref = _asyncToGenerator(function(req, res, next) {
        var podcast, err;
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
                        Podcast.findById({
                            _id: req.params.podcastId,
                            user_id: req.headers.user_id
                        })
                    ];
                case 1:
                    podcast = _state.sent();
                    if (!podcast) next(new NotFound());
                    fs.unlink(podcast.file_path, function(err) {
                        throw err;
                    });
                    return [
                        4,
                        podcast.remove()
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
                    console.log(err);
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
