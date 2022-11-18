const Joi = require('joi');
exports.objectId = () => Joi.string().hex().length(24);
