const { Router } = require('express');
const { auth } = require('express-openid-connect');
require('dotenv').config();

const authController = require('../../controllers/auth');

// dotenv.config({ path: '../.env' });
const auth0Router = Router();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.PROD_SECRET,
  baseURL: process.env.PROD_BASEURL,
  clientID: process.env.PROD_CLIENTID,
  issuerBaseURL: process.env.PROD_ISSUER,
};


// sten-Auth0 import
auth0Router.use(auth(config));

auth0Router.get('/', (req, res) => {
    console.log(`is auth: ${req.oidc.isAuthenticated()}`);
});


module.exports = auth0Router;
