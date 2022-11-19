const express = require('express');
const schemaMiddleware = require('../../middlewares/schemaMiddleware');
const { avaterSchema } = require('./avatar.schema');

const avatarRouter = express.Router();

avatarRouter.get('/', (req, res) => {
  res.json({data:"all avatars"});
});

avatarRouter.post('/', schemaMiddleware(avaterSchema), (req, res) => {
  res.json({data:req.body});
});

module.exports = avatarRouter;
