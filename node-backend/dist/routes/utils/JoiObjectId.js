var Joi = require("joi");
exports.objectId = function() {
    return Joi.string().hex().length(24);
};
