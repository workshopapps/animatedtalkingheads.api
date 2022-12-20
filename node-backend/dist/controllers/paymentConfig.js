var dotenv = require("dotenv");
var paystack = function(request) {
    dotenv.config({
        path: "../.env"
    });
    var MySecretKey = process.env.paystack_live_secret_key;
    var initializePayment = function(form, mycallback) {
        // console.log(MySecretKey)
        var options = {
            url: "https://api.paystack.co/transaction/initialize",
            headers: {
                authorization: MySecretKey,
                "content-type": "application/json",
                "cache-control": "no-cache"
            },
            form: form
        };
        var callback = function(error, response, body) {
            return mycallback(error, body);
        };
        request.post(options, callback);
    };
    var verifyPayment = function(ref, mycallback) {
        var options = {
            url: "https://api.paystack.co/transaction/verify/" + encodeURIComponent(ref),
            headers: {
                authorization: MySecretKey,
                "content-type": "application/json",
                "cache-control": "no-cache"
            }
        };
        var callback = function(error, response, body) {
            return mycallback(error, body);
        };
        request(options, callback);
    };
    return {
        initializePayment: initializePayment,
        verifyPayment: verifyPayment
    };
};
module.exports = paystack;
