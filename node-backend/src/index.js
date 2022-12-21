const app = require('./app');
const mongoose = require('mongoose');
const express = require('express');

const fs = require('fs');

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

if (!fs.existsSync('./uploads/podcasts')) {
  fs.mkdirSync('./uploads/podcasts');
}

const PORT = process.env.PORT || 4000;

const DB =
  process.env.NODE_ENV == 'development'
    ? process.env.mongo_dev_url
    : process.env.mongo_url;
mongoose.connect(DB).then(() => console.log('DB connection successful!'));

mongoose.set('strict', true);
mongoose.set('strictPopulate', false);
mongoose.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;

    delete ret.__v;
  },
});
mongoose.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;

    delete ret.__v;
  },
});

async function initialize() {
  app.listen(PORT);
}

initialize().then((_) => {
  console.log(`server is online on PORT:${PORT}`);
});
