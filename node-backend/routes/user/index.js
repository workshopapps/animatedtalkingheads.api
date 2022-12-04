/* eslint-disable prettier/prettier */
const { Router } = require('express');
const authController = require('../../controllers/auth');

const router = Router();

// router.get('/signup', authController.signup_get);
// router.post('/signup', authController.signup_post);
// router.get('/login', authController.login_get);
// router.post('/login', authController.login_post);
// router.get('/logout', authController.logout_get);

// router.get('/', (req, res) => {
//     console.log(`is auth: ${req.oidc.isAuthenticated()}`);
//     res.render("index", { title: "Express Demo"});

//     res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

router.get('/callback', (req, res) => {
    // console.log(`is auth: ${req.oidc.isAuthenticated()}`);
    // res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});


module.exports = router;