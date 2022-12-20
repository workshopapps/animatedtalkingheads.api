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
var _require = require("bullmq"), Queue = _require.Queue, Worker = _require.Worker, Job = _require.Job;
var path = require("path");
var fs = require("fs");
var AnimatedVideo = require("../../models/AnimatedVideo");
var process = require("process");
var captureMessage = require("@sentry/node").captureMessage;
var Email = require("../../utils/email");
var User = require("../../models/User");
var redisConnection = require("../../utils/redis");
var queue = new Queue("animated-video", _objectSpread({}, redisConnection));
// new Redis(
//   'rediss://red-ceadi1en6mphc8t71nvg:qaMmuQ9hi80WccfE5ldZUIUYhisD5pME@oregon-redis.render.com:6379'
// ).flushdb(() => {
//   console.log('queue cleared');
// });
var processorFile = path.join(__dirname, "processing.js");
var worker = new Worker(queue.name, processorFile, _objectSpreadProps(_objectSpread({}, redisConnection), {
    concurrency: 2
}));
worker.on("error", function() {
    var _ref = _asyncToGenerator(function(job) {
        return __generator(this, function(_state) {
            console.log(job.message);
            captureMessage(job);
            return [
                2
            ];
        });
    });
    return function(job) {
        return _ref.apply(this, arguments);
    };
}());
worker.on("failed", function() {
    var _ref = _asyncToGenerator(function(job, err) {
        var originalFolder, metaJsonFilePath, testFolder, animatedVid, user, sendEmail, err1;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        6,
                        ,
                        7
                    ]);
                    originalFolder = path.resolve(path.dirname(process.cwd() + "/") + "/pyhton-backend/data/user_data/".concat(job.id, "/animation_sound.mp4"));
                    metaJsonFilePath = path.resolve(path.dirname(process.cwd() + "/") + "/pyhton-backend/test_data/".concat(job.id, ".json"));
                    testFolder = path.resolve(path.dirname(process.cwd() + "/") + "/pyhton-backend/data/user_data/".concat(job.id, "/"));
                    fs.rmdir(testFolder, {
                        recursive: true,
                        force: true
                    }, function(error) {
                        throw error;
                    });
                    captureMessage(err.stack);
                    if (!!fs.existsSync(originalFolder)) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        AnimatedVideo.findByIdAndUpdate(job.data.jobConfig.animated_video_id, {
                            status: "ERROR"
                        })
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
                case 2:
                    fs.unlink(metaJsonFilePath, function(err) {
                        if (err) {
                            throw err;
                        }
                    });
                    return [
                        4,
                        AnimatedVideo.findByIdAndUpdate(job.id, {
                            video_url: process.env.reqHost + "/user_data/" + "".concat(job.id, "/animation_sound.mp4"),
                            status: "COMPLETED"
                        })
                    ];
                case 3:
                    animatedVid = _state.sent();
                    return [
                        4,
                        User.findById(animatedVid.user_id)
                    ];
                case 4:
                    user = _state.sent();
                    sendEmail = new Email(_objectSpread({}, user), animatedVid.video_url);
                    return [
                        4,
                        sendEmail.sendVideo()
                    ];
                case 5:
                    _state.sent();
                    return [
                        3,
                        7
                    ];
                case 6:
                    err1 = _state.sent();
                    captureMessage(err1);
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
    return function(job, err) {
        return _ref.apply(this, arguments);
    };
}());
worker.on("completed", function() {
    var _ref = _asyncToGenerator(function(job, returnvalue) {
        var metaJsonFilePath, originalFolder, animatedVid, user, sendEmail, err;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    metaJsonFilePath = path.resolve(path.dirname(process.cwd() + "/") + "/pyhton-backend/test_data/".concat(job.id, ".json"));
                    originalFolder = path.resolve(path.dirname(process.cwd() + "/") + "/pyhton-backend/data/user_data/".concat(job.id, "/animation_sound.mp4"));
                    if (!!fs.existsSync(originalFolder)) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        AnimatedVideo.findByIdAndUpdate(job.id, {
                            status: "ERROR"
                        })
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
                case 2:
                    fs.unlink(metaJsonFilePath, function(err) {
                        if (err) {
                            throw err;
                        }
                    });
                    return [
                        4,
                        AnimatedVideo.findByIdAndUpdate(job.id, {
                            video_url: process.env.reqHost + "/user_data/" + "".concat(job.id, "/animation_sound.mp4"),
                            status: "COMPLETED"
                        })
                    ];
                case 3:
                    animatedVid = _state.sent();
                    return [
                        4,
                        User.findById(animatedVid.user_id)
                    ];
                case 4:
                    user = _state.sent();
                    sendEmail = new Email(_objectSpread({}, user), process.env.reqHost + "/user_data/" + "".concat(job.id, "/animation_sound.mp4"));
                    _state.label = 5;
                case 5:
                    _state.trys.push([
                        5,
                        7,
                        ,
                        8
                    ]);
                    return [
                        4,
                        sendEmail.sendVideo()
                    ];
                case 6:
                    _state.sent();
                    return [
                        3,
                        8
                    ];
                case 7:
                    err = _state.sent();
                    captureMessage(err);
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
    return function(job, returnvalue) {
        return _ref.apply(this, arguments);
    };
}());
var runPythonScript = function() {
    var _ref = _asyncToGenerator(function(jobConfig) {
        var res;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        queue.add(jobConfig.animated_video_id, {
                            jobConfig: jobConfig
                        }, {
                            jobId: jobConfig.animated_video_id
                        })
                    ];
                case 1:
                    res = _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return function runPythonScript(jobConfig) {
        return _ref.apply(this, arguments);
    };
}();
module.exports = runPythonScript;
