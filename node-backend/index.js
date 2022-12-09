const express = require('express');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const path = require('path');
const pug = require('pug');
const auth = require('./middlewares/authMiddleware');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const docs = require('./docs');
const avatarRouter = require('./routes/avatars');
const animatedVideoRouter = require('./routes/animatedvidoes/');
const podcastRouter = require('./routes/podcasts');
const paymentRoute = require('./routes/payment/index');
const NotFound = require('./utils/errors/NotFound');

// sten-add auth0 router dir
const auth0Router = require('./routes/auth0');


//email
const authRoutes = require('./routes/user/index');
const rauthRoutes = require('./routes/emails/rindex');

// const cookieParser = require('cookie-parser');
// const path = require('path');
const errorController = require('./controllers/error.controller');

const userSettingsRoute = require('./routes/protectedRoutes/userSettings');

// DONT PUT ANYTHING BEFORE THIS!!!!!!!

const app = express();

Sentry.init({
  dsn: 'https://847f70043a354431a605fe554591ae6a@o4504282743635968.ingest.sentry.io/4504293110317056',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({
      // to trace all requests to the default router
      app,
      // alternatively, you can specify the routes you want to trace:
      // router: someRouter,
    }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

app.use(Sentry.Handlers.tracingHandler());

// WRITE YOUR CODE AFTER THIS!!!!!!

const DB = process.env.mongo_url;

app.use(morgan('tiny'));

//get payment for development purpose
const { getPayments } = require('./controllers/payment');
app.get('/getpayments', getPayments);
// process.env.NODE_ENV != 'production' &&
//   (process.env.ComSpec =
//     process.env.SHELL && (process.env.COMSPEC = process.env.shell));
// console.log(process.env.ComSpec);
mongoose.connect(DB).then(() => console.log('DB connection successful!'));

mongoose.set('strict', true);
mongoose.set('strictPopulate', false);
mongoose.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;

    delete ret.__v;
  },
});
mongoose.set('toObject', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;

    delete ret.__v;
  },
});

const PORT = process.env.PORT || 4000;

const fs = require('fs');

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

if (!fs.existsSync('./uploads/podcasts')) {
  fs.mkdirSync('./uploads/podcasts');
}

// app configs.
app.use('/uploads', express.static(__dirname + '/uploads'));

// app.use(authRoutes);

app.use(express.json());
app.use(cors());
// app.use('/todos', todoRouter);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(docs));
app.use('/podcasts', podcastRouter);
app.use('/animated-videos', animatedVideoRouter);

app.use('/auth', authRoutes);
app.use('/rauth', rauthRoutes);

app.use('/settings', auth, userSettingsRoute);

app.use('/uploads', express.static('./uploads'));
app.use('/auth0', auth0Router); // sten-register auth0 url

// app.use('/uploads', express.static('./uploads'));

app.use(authRoutes);
app.use(rauthRoutes);
 /// contatct page
app.post('/contact', (req, res) => {
  const { email = '', name = '', message = '' } = req.body

  mailer({ email, name, text: message }).then(() => {
    console.log(`Sent the message "${message}" from <${name}> ${email}.`);
    res.redirect('/#success');
  }).catch((error) => {
    console.log(`Failed to send the message "${message}" from <${name}> ${email} with the error ${error && error.message}`);
    res.redirect('/#error');
  })
})



///// payment route

app.use(express.static(path.join(__dirname, 'public/')));
app.set('view engine', pug);

app.get('/error', (req, res) => {
  res.render('error.pug');
});
app.use('/', auth, paymentRoute);

app.all('*', (req, res, next) => {
  next(new NotFound());
});

app.use(Sentry.Handlers.errorHandler());

app.use(errorController);

//initialize the app.
async function initialize() {
  app.listen(PORT);
}

initialize().finally(() => console.log(`app started on port:${PORT}`));
