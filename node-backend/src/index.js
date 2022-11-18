const express = require('express');
const { join } = require('path');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const docs = require('./docs');
const avatarRouter = require('./routes/avatars');
const NotFound = require('./utils/errors/NotFound');

const app = express();
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
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());
// app.use('/todos', todoRouter);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(docs));
app.use('/avatars', avatarRouter);
app.all('*', (req, res, next) => {
  next(new NotFound());
});

//initialize the app.
async function initialize() {
  app.listen(PORT);
}

initialize().finally(() => console.log(`app started on port:${PORT}`));
