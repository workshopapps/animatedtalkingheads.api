const Joi = require('joi');
const { objectId } = require('../utils/JoiObjectId');

exports.podcastSchema = Joi.object({
  file_name: Joi.string(),
});
