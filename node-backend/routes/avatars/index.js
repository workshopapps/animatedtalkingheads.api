const express = require('express');
const schemaMiddleware = require('../../middlewares/schemaMiddleware');
const { avaterSchema } = require('./avatar.schema');

const avatarRouter = express.Router();

avatarRouter.get('/', (req, res) => {
  res.send('birds');
});

avatarRouter.post('/', schemaMiddleware(avaterSchema), (req, res) => {
  res.send(req.body);
});

module.exports = avatarRouter;
