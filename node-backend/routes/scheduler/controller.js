const express = require('express')
const app = express()
const userSession = require('express-user-session')
userSession.init(app, options)
// Quick way:
userSession.serve(app)
// Or do the manual way; ie- within your existing Express routes:
userSession.start(req)
// ex: app.post('/logout', (req, res) => ...
userSession.destroy(req)
userSession.init(app, {
    name : 'express-user-session',
    secret: cryptoRandomString({length: 32 }),
    resave: false, //< refreshes the cookie each time req obj modified
    saveUninitialized : false, //< do not save sessions that do not login
    storeCheckPeriod : 120000, // In 2 minutes expired sessions will be purged from memory.
    cookie: {
      maxAge : 60000 * 2880  //< 48 hours
    }
  })
  router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy((err) => {
      if (err) return next(err);
      return res.redirect('/login');
    });
  });
