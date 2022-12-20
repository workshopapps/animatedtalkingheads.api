var Router = require("express").Router;
var rauthController = require("../../controllers/rauth");
var contactController = require("../../controllers/contact");
var rrouter = Router();
// rrouter.post('/signup', rauthController.signup_post);
rrouter.post("/forgotpassword", rauthController.forgotpassword);
rrouter.patch("/resetpassword/:token", rauthController.resetpassword);
rrouter.post("/contact", contactController.contact);
module.exports = rrouter;
