const { Router } = require('express');
const rauthController = require('../../controllers/rauth');

const rrouter = Router();

rrouter.post('/forgotpassword', rauthController.forgotpassword);
rrouter.get('/resetpassword', rauthController.resetpassword);

module.exports = rrouter;