"use strict";
const router = require('express').Router();
const auth = require('../../middlewares/authMiddleware');
const { verifyRequest , paymentRequest , getUserPayment , getReceipt  } = require('../../controllers/payment');
router.post('/paystack/pay', auth, paymentRequest);
router.get('/paystack/callback', verifyRequest);
router.get('/receipt/:id', getReceipt);
router.get('/subscription', auth, getUserPayment);
module.exports = router;
