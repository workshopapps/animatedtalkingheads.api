const router = require('express').Router()
const {verifyRequest,paymentRequest, getReceipt} = require('../../controllers/payment')
router.post('/paystack/pay', paymentRequest);

router.get('/paystack/callback',verifyRequest);

router.get('/receipt/:id',getReceipt)

module.exports = router
