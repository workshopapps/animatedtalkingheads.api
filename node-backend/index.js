const express = require('express');
const path = require('path');
const pug = require('pug');

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

const authRoutes = require('./routes/user/index');
const rauthRoutes = require('./routes/emails/rindex');
// const cookieParser = require('cookie-parser');
// const path = require('path');
const errorController = require('./controllers/error.controller');

const app = express();
const DB = process.env.mongo_url;

app.use(morgan('tiny'));

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

app.use('/uploads', express.static('./uploads'));
app.use('/auth0', auth0Router); // sten-register auth0 url

// app.use('/uploads', express.static('./uploads'));

app.use(authRoutes);
app.use(rauthRoutes);

///// payment route

app.use(express.static(path.join(__dirname, 'public/')));
app.set('view engine', pug);
app.get('/test-pay', (req, res) => {
  res.render('index.pug');
});
app.get('/error', (req, res) => {
  res.render('error.pug');
});
app.use('/', paymentRoute);

app.all('*', (req, res, next) => {
  next(new NotFound());
});

app.use(errorController);

//initialize the app.
async function initialize() {
  app.listen(PORT);
}

initialize().finally(() => console.log(`app started on port:${PORT}`));
