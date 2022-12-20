//paystack config
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
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
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
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
var Payment = require("../models/Payment").Payment;
var request = require("request");
var _ = require("lodash");
var _require = require("./paymentConfig")(request), initializePayment = _require.initializePayment, verifyPayment = _require.verifyPayment;
var paymentRequest = function(req, res) {
    try {
        req.body.email = req.decoded.email;
        console.log(req.body);
        if (!req.body.amount && !req.body.full_name && !req.body.email) {
            return res.json({
                message: "email, amount or name missing"
            });
        }
        // return
        var form = _.pick(req.body, [
            "amount",
            "email",
            "full_name"
        ]);
        form.metadata = {
            full_name: form.full_name
        };
        form.amount *= 100;
        initializePayment(form, function(error, body) {
            try {
                if (error) {
                    //handle errors
                    console.log(error);
                    return res.json({
                        error: error
                    });
                    return;
                }
                response = JSON.parse(body);
                console.log(response);
                // return
                res.json({
                    link: response.data.authorization_url
                });
            } catch (error1) {
                res.json({
                    error: error1
                });
            }
        });
    } catch (error) {
        res.json({
            error: error
        });
    }
};
var verifyRequest = function(req, res) {
    try {
        var ref = req.query.reference;
        verifyPayment(ref, function(error, body) {
            if (error) {
                //handle errors appropriately
                console.log(error);
                return res.json({
                    message: "payment verification"
                });
            }
            response = JSON.parse(body);
            var data = _.at(response.data, [
                "reference",
                "amount",
                "customer.email",
                "metadata.full_name"
            ]);
            var ref;
            ref = _slicedToArray(data, 4), reference = ref[0], amount = ref[1], email = ref[2], full_name = ref[3], ref;
            var newPayment = {
                reference: reference,
                amount: amount,
                email: email,
                full_name: full_name
            };
            var payment = new Payment(newPayment);
            payment.save().then(function(payment) {
                if (!payment) {
                    return res.json({
                        message: "something happened"
                    });
                }
                res.status(201).json(payment);
            }).catch(function(e) {
                res.json({
                    message: e
                });
            });
        });
    } catch (error) {
        res.json({
            error: error
        });
    }
};
var getReceipt = function(req, res) {
    try {
        var id = req.params.id;
        Payment.findById(id).then(function(payment) {
            if (!payment) {
                //handle error when the payment is not found
                res.redirect("/error");
            }
            res.render("success.pug", {
                payment: payment
            });
        }).catch(function(e) {
            res.redirect("/error");
        });
    } catch (error) {
        res.json({
            error: error
        });
    }
};
var getPayments = function() {
    var _ref = _asyncToGenerator(function(req, res) {
        var transactions, error;
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
                        Payment.find({})
                    ];
                case 1:
                    transactions = _state.sent();
                    if (transactions < 1) {
                        return [
                            2,
                            res.json({
                                message: "no payments yet"
                            })
                        ];
                    }
                    res.json(transactions);
                    return [
                        3,
                        3
                    ];
                case 2:
                    error = _state.sent();
                    res.json({
                        error: error
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
    return function getPayments(req, res) {
        return _ref.apply(this, arguments);
    };
}();
var getUserPayment = function() {
    var _ref = _asyncToGenerator(function(req, res) {
        var transaction, error;
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
                        Payment.find({
                            email: req.decoded.email
                        })
                    ];
                case 1:
                    transaction = _state.sent();
                    if (!transaction) {
                        return [
                            2,
                            res.json({
                                message: "no payments yet"
                            })
                        ];
                    }
                    res.json(transaction);
                    return [
                        3,
                        3
                    ];
                case 2:
                    error = _state.sent();
                    res.json({
                        error: error
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
    return function getUserPayment(req, res) {
        return _ref.apply(this, arguments);
    };
}();
module.exports = {
    paymentRequest: paymentRequest,
    verifyRequest: verifyRequest,
    getReceipt: getReceipt,
    getPayments: getPayments,
    getUserPayment: getUserPayment
};
