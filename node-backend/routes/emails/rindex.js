const { Router } = require('express');
const rauthController = require('../../controllers/rauth');

const rrouter = Router();

rrouter.post('/authenticate', authenticateSchema, authenticate);
rrouter.post('/refresh-token', refreshToken);
rrouter.post('/revoke-token', authorize(), revokeTokenSchema, revokeToken);
rrouter.post('/register', registerSchema, register);
rrouter.post('/verify-email', verifyEmailSchema, verifyEmail);
rrouter.post('/forgot-password', forgotPasswordSchema, forgotPassword);
rrouter.post('/validate-reset-token', validateResetTokenSchema, validateResetToken);
rrouter.post('/reset-password', resetPasswordSchema, resetPassword);
//rrouter.get('/', authorize(Role.Admin), getAll);
rrouter.get('/:id', authorize(), getById);
//rrouter.post('/', authorize(Role.Admin), createSchema, create);
rrouter.put('/:id', authorize(), updateSchema, update);
rrouter.delete('/:id', authorize(), _delete);

module.exports = router;

/* rrouter.post('/signup', rauthController.signup);
rrouter.post('/forgotpassword', rauthController.forgotpassword);
rrouter.get('/resetpassword', rauthController.resetpassword); */

module.exports = rrouter;