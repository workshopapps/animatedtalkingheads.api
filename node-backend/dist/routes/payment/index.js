var router = require("express").Router();
var auth = require("../../middlewares/authMiddleware");
var _require = require("../../controllers/payment"), verifyRequest = _require.verifyRequest, paymentRequest = _require.paymentRequest, getUserPayment = _require.getUserPayment, getReceipt = _require.getReceipt;
router.post("/paystack/pay", auth, paymentRequest);
router.get("/paystack/callback", verifyRequest);
router.get("/receipt/:id", getReceipt);
router.get("/subscription", auth, getUserPayment);
module.exports = router;
