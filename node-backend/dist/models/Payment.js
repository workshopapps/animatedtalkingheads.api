"use strict";
const { mongoose  } = require('mongoose');
const paymentSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    reference: {
        type: String,
        required: true
    }
});
const Payment = mongoose.model('Payment', paymentSchema);
module.exports = {
    Payment
};
