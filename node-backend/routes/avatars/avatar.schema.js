const Joi = require('joi');
const { objectId } = require('../utils/JoiObjectId');

exports.avaterSchema = Joi.object({
  file_path: Joi.string().required().min(5),
  podcast_id: objectId(),
  gender:Joi.string(),
  user_id:Joi.string().required(),
  id:Joi.string().required(),
  accessories: Joi.object({
    cloth_type:objectId(),
    skin_type:objectId(),
    hair_type:objectId(),
      }),
});
