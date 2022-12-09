//paystack config
const {Payment} = require('../models/Payment')
const request = require('request');
const _ = require('lodash');
const {initializePayment, verifyPayment} = require('./paymentConfig')(request);
const paymentRequest = (req, res) => {
try{
    req.body.email=req.decoded.email
    console.log(req.body)
    if(!req.body.amount&&!req.body.full_name&&!req.body.email){
        return res.json({message:"email, amount or name missing"})
    }
// return
    const form = _.pick(req.body,['amount','email','full_name']);
    form.metadata = {
        full_name : form.full_name
    }
    form.amount *= 100;

    initializePayment(form, (error, body)=>{
        try{
        if(error){
            //handle errors
            console.log(error);
            return res.json({error})
            return;
        }
        response = JSON.parse(body);
        console.log(response)
        // return
        res.json({link:response.data.authorization_url})
            }
            catch(error){
                res.json({error})
            }
    });
    }catch(error){
        res.json({error})
    }
}

const verifyRequest= (req,res) => {
    try{
    const ref = req.query.reference;
    verifyPayment(ref, (error,body)=>{
        if(error){
            //handle errors appropriately
            console.log(error)
            return res.json({message:"payment verification"});
        }
        response = JSON.parse(body);        

        const data = _.at(response.data, ['reference', 'amount','customer.email', 'metadata.full_name']);

        [reference, amount, email, full_name] =  data;
        let newPayment = {reference, amount, email, full_name}
        const payment = new Payment(newPayment)
        payment.save().then((payment)=>{
            if(!payment){
                return res.json({message:"something happened"});
            }
            res.redirect('/receipt/'+payment._id);
        }).catch((e)=>{
            res.json({message:e});
        })
    })
}catch(error){
    res.json({error})
}
}
const getReceipt = (req, res)=>{
    try{
    const id = req.params.id;
    Payment.findById(id).then((payment)=>{
        if(!payment){
            //handle error when the payment is not found
            res.redirect('/error')
        }
        res.render('success.pug',{payment});
    }).catch((e)=>{
        res.redirect('/error')
    })
}
catch(error){
    res.json({error})
}
}
const getPayments=async (req,res)=>{
    try {
        const transactions = await Payment.find({})
        if(transactions<1){
            return res.json({message:"no payments yet"})
        }
        res.json(transactions)
    } catch (error) {
        res.json({error})
    }
}

module.exports={paymentRequest, verifyRequest, getReceipt, getPayments}

