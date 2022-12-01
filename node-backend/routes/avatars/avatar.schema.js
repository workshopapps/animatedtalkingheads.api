const Joi = require('joi');
const { objectId } = require('../utils/JoiObjectId');

exports.avaterSchema = Joi.object({
  head_file_path: Joi.string().required().min(5),
  scene_file_path: Joi.string().required().min(5),
  user_id:Joi.string().required(),
  podcast_id:Joi.string(),
  gender:Joi.string(),
  accessories: Joi.object({
  cloth_type:objectId(),
  skin_type:objectId(),
  hair_type:objectId(),
      }),
});
