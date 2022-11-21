const express = require('express');
const schemaMiddleware = require('../../middlewares/schemaMiddleware');
const { avaterSchema } = require('./avatar.schema');
const {
  addAvatar,
  addCloth,
  addSkin,
  addHair,
} = require('../../controllers/avatars');
const avatarRouter = express.Router();

avatarRouter.get('/', (req, res) => {
  res.json({ data: 'all avatars' });
});

avatarRouter.post('/', schemaMiddleware(avaterSchema), addAvatar);
avatarRouter.post('/cloth', addCloth);
avatarRouter.post('/hair', addHair);
avatarRouter.post('/skin', addSkin);

avatarRouter.post('/', schemaMiddleware(avaterSchema), (req, res) => {
  res.json({ data: req.body });
});

// avatarRouter.post('/',)
module.exports = avatarRouter;
