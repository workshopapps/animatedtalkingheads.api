const { Router } = require('express');
const rauthController = require('../../controllers/rauth');
const accountService = require('../../jobs/service');

const rrouter = Router();

rrouter.post('/authenticate',function(req, res){rauthController.authenticateSchema}, function(req, res){rauthController.authenticate});
rrouter.post('/refresh-token', function(req, res){rauthController.refreshToken});
//rrouter.post('/revoke-token', authorize(), revokeTokenSchema, revokeToken);
rrouter.post('/register', function(req, res){registerSchema}, function(req, res){register});
rrouter.post('/verify-email', function(req, res){verifyEmailSchema}, function(req, res){verifyEmail});
rrouter.post('/forgot-password', function(req, res){forgotPasswordSchema}, function(req, res){forgotPassword});
rrouter.post('/validate-reset-token', function(req, res){validateResetTokenSchema}, function(req, res){validateResetToken});
rrouter.post('/reset-password', function(req, res){resetPasswordSchema}, function(req, res){resetPassword});
//rrouter.get('/', authorize(Role.Admin), getAll);
//rrouter.get('/:id', authorize(), getById);
//rrouter.post('/', authorize(Role.Admin), createSchema, create);
//rrouter.put('/:id', authorize(), updateSchema, update);
//rrouter.delete('/:id', function(req, res){authorize()}, function(req, res){_delete});

module.exports = rrouter;

/* rrouter.post('/signup', rauthController.signup);
rrouter.post('/forgotpassword', rauthController.forgotpassword);
rrouter.get('/resetpassword', rauthController.resetpassword); */

//module.exports = rrouter;