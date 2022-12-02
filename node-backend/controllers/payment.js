//paystack config
const {Payment} = require('../models/Payment')
const request = require('request');
const _ = require('lodash');
const {initializePayment, verifyPayment} = require('./paymentConfig')(request);
const paymentRequest = (req, res) => {
try{
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
        if(error){
            //handle errors
            console.log(error);
            return res.redirect('/error')
            return;
        }
        response = JSON.parse(body);
        console.log(response)
        // return
        res.redirect(response.data.authorization_url)

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
            return res.redirect('/error');
        }
        response = JSON.parse(body);        

        const data = _.at(response.data, ['reference', 'amount','customer.email', 'metadata.full_name']);

        [reference, amount, email, full_name] =  data;
        
        let newPayment = {reference, amount, email, full_name}

        const payment = new Payment(newPayment)

        payment.save().then((payment)=>{
            if(!payment){
                return res.redirect('/error');
            }
            res.redirect('/receipt/'+payment._id);
        }).catch((e)=>{
            res.redirect('/error');
        })
    })
}catch(error){
    res.json({error})
}
}

const getReceipt = (req, res)=>{
    try{
    const id = req.params.id;
    Donor.findById(id).then((donor)=>{
        if(!donor){
            //handle error when the donor is not found
            res.redirect('/error')
        }
        res.render('success.pug',{donor});
    }).catch((e)=>{
        res.redirect('/error')
    })
}
catch(error){
    res.json({error})
}
}

module.exports={paymentRequest, verifyRequest, getReceipt}

