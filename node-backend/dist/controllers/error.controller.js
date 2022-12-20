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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
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
var ApiError = require("./../utils/errors/ApiError");
var Typebox = require("@sinclair/typebox");
var _require = require("joi"), ValidationError = _require.ValidationError, object = _require.object;
var TypeboxError = require("typebox-express-middleware").TypeboxError;
var captureMessage = require("@sentry/node").captureMessage;
var handleCastErrorDB = function(err) {
    var message = "Invalid ".concat(err.path, ": ").concat(err.value, ".");
    return new ApiError(message, 400);
};
var handleDuplicateFieldsDB = function(err) {
    var value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    var message = "Duplicate field value: ".concat(value, ". Please use another value!");
    return new ApiError(message, 400);
};
var handleValidationErrorDB = function(err) {
    var errors = Object.values(err.errors).map(function(el) {
        return el.message;
    });
    var message = "Invalid input data. ".concat(errors.join(". "));
    return new ApiError(message, 400);
};
var handleJWTError = function() {
    return new ApiError("Invalid token. Please log in again!", 401);
};
var handleJWTExpiredError = function() {
    return new ApiError("Your token has expired! Please log in again.", 401);
};
var sendError = function(err, req, res) {
    console.error("ERROR \uD83D\uDCA5", err);
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};
module.exports = function(err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    // if (process.env.NODE_ENV === 'development') {
    //   sendErrorDev(err, req, res);
    // }
    // else if (process.env.NODE_ENV === 'production') {
    var error = _objectSpread({}, err);
    error.message = err.message;
    console.log(err);
    if (error.code === "LIMIT_FILE_SIZE") error = new ApiError("Payload too large, the limit is 250mb", 413);
    else if (error.name === "CastError") error = handleCastErrorDB(error);
    else if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    else if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    else if (error.name === "JsonWebTokenError") error = handleJWTError();
    else if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    else if (_instanceof(error, ValidationError)) error = error.details.map(function(err) {
        return err.message;
    });
    else if (error.type === "NotFound") error = error;
    else if (err.name == "TypeboxError") {
        error.message = error.errors;
        error = error;
    } else {
        error.message = "Internal Server Error";
        captureMessage(error);
    }
    sendError(error, req, res);
// }
};
