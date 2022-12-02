
const { Router } = require('express');
const authController = require('../../controllers/auth');

const router = Router();

router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
// router.get('/logout', authController.logout_get);

module.exports = router;