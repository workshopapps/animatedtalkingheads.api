
const dotenv = require('dotenv');
const paystack = (request) => {
dotenv.config({ path: '../.env' });
const MySecretKey = process.env.paystack_live_secret_key;
    
const initializePayment = (form, mycallback) => {
            // console.log(MySecretKey)
const options = {
        url : 'https://api.paystack.co/transaction/initialize',
        headers : {
            authorization: MySecretKey,
            'content-type': 'application/json',
            'cache-control': 'no-cache'
        },
       form
    }
const callback = (error, response, body)=>{
        return mycallback(error, body);
    }
    request.post(options,callback);
}
const verifyPayment = (ref, mycallback) => {
    const options = {
        url : 'https://api.paystack.co/transaction/verify/'+encodeURIComponent(ref    ),
        headers : {
            authorization: MySecretKey,
            'content-type': 'application/json',
            'cache-control': 'no-cache'
       }
    }
const callback = (error, response, body)=>{
        return mycallback(error, body);
    }
    request(options,callback);
}
    return {initializePayment, verifyPayment};
}

module.exports = paystack;
