const Joi = require('joi');
const { objectId } = require('../utils/JoiObjectId');

exports.podcastSchema = Joi.object({
  user_id: objectId(),
});
