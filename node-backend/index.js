const express = require('express');
const path = require('path')
const pug = require('pug')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const docs = require('./docs');
const avatarRouter = require('./routes/avatars');
const podcastRouter = require('./routes/podcasts');
const NotFound = require('./utils/errors/NotFound');

const authRoutes = require('./routes/user/index');
// const cookieParser = require('cookie-parser');
const path = require('path');
const errorController = require('./controllers/error.controller');

dotenv.config({ path: './.env' });
const app = express();
const DB = process.env.mongo_url;

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

app.use(express.json());
app.use(cors())
// app.use('/todos', todoRouter);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(docs));
app.use('/avatars', avatarRouter);
app.use('/podcasts', podcastRouter);
app.use(authRoutes);
app.use('/uploads', express.static('./uploads'));


///// payment route
const paymentRoute = require('./routes/payment/index')
app.use(express.static(path.join(__dirname, 'public/')));
app.set('view engine', pug);
app.get('/',(req, res) => {
    res.render('index.pug');
});
app.get('/error', (req, res)=>{
    res.render('error.pug');
})
app.use('/',paymentRoute)





app.all('*', (req, res, next) => {
  next(new NotFound());
});

app.use(errorController);

//initialize the app.
async function initialize() {
  app.listen(PORT);
}

initialize().finally(() => console.log(`app started on port:${PORT}`));
