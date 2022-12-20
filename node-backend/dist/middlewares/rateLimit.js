"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>rateLimit
});
const _expressRateLimit = /*#__PURE__*/ _interopRequireDefault(require("express-rate-limit"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function rateLimit(rate, timeLimit) {
    return (0, _expressRateLimit.default)({
        windowMs: timeLimit ? timeLimit * 60 * 1000 : 10 * 60 * 1000,
        max: rate || 100,
        standardHeaders: true,
        legacyHeaders: false
    });
}
