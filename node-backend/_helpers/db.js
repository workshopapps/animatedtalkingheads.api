const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const mongoose = require('mongoose');
//const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
//mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
//mongoose.Promise = global.Promise;

module.exports = {
    Account: require('../models/UsersAuth'),
    RefreshToken: require('../models/tokres'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}