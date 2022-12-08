const { Router } = require('express');
const rauthController = require('../../controllers/rauth');

const rrouter = Router();


rrouter.post('/signup', rauthController.signup_post);
rrouter.post('/forgotpassword', rauthController.forgotpassword);
rrouter.patch('/resetpassword/:token', rauthController.resetpassword);

module.exports = rrouter;