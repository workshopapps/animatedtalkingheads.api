const { Router } = require('express');
const rauthController = require('../../controllers/rauth');
const contactController = require('../../controllers/contact');

const rrouter = Router();


rrouter.post('/signup', rauthController.signup_post);
rrouter.post('/forgotpassword', rauthController.forgotpassword);
rrouter.patch('/resetpassword/:token', rauthController.resetpassword);
rrouter.post('/contact', contactController.contact);



module.exports = rrouter;