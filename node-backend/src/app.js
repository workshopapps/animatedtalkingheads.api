const path = require('path');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const pug = require('pug');
const auth = require('./middlewares/authMiddleware');
import rateLimit from './middlewares/rateLimit';
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const docs = require('./docs');

const animatedVideoRouter = require('./routes/animatedvidoes');
const podcastRouter = require('./routes/podcasts');
const paymentRoute = require('./routes/payment/index');
const NotFound = require('./utils/errors/NotFound');

// sten-add auth0 router dir

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
  maxValueLength: 700,
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app

app.set('trust proxy', true);

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// WRITE YOUR CODE AFTER THIS!!!!!!

app.use(express.static(path.join(__dirname, 'public/')));
app.use(express.static(path.join(process.cwd(), '.././pyhton-backend/data/')));

app.use((req, res, next) => {
  process.env.reqHost = req.protocol + '://' + req.get('host');
  next();
});

app.use(morgan('tiny'));
process.env.NODE_ENV !== 'development' && (process.env.NODE_ENV = 'production');
//get payment for development purpose
const { getPayments } = require('./controllers/payment');
app.get('/getpayments', getPayments);
// process.env.NODE_ENV != 'production' &&
//   (process.env.ComSpec =
//     process.env.SHELL && (process.env.COMSPEC = process.env.shell));
// console.log(process.env.ComSpec);

// app configs.
app.options('*', cors());
app.use(cors());
app.use('/uploads', express.static(__dirname + '/uploads'));

// app. H thRoutes);

app.use(express.json());

// app.use('/todos', todoRouter);
const { router } = require('./controllers/run-python/index');
app.use('/admin/queues', router);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(docs));
app.use('/api/v1/podcasts', podcastRouter);
app.use('/api/v1/animated-videos', animatedVideoRouter);
app.use('/api/v1/auth', rateLimit(10, 10), authRoutes);
app.use('/api/v1/rauth', rauthRoutes);
app.use('/api/v1/settings', auth, userSettingsRoute);

app.use('/uploads', express.static('./uploads'));

// app.use('/uploads', express.static('./uploads'));

///// payment route

app.set('view engine', pug);

app.get('/error', (req, res) => {
  res.render('error.pug');
});
app.use('/api/v1/', paymentRoute);

app.all('*', (req, res, next) => {
  next(new NotFound());
});

app.use(Sentry.Handlers.errorHandler());

app.use(errorController);

//initialize the app.
module.exports = app;
