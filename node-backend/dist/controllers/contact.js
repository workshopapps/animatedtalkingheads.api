//const User = require('../models/User');
"use strict";
const sendEmail = require('./../utils/contactemail');
module.exports.contact = async (req, res)=>{
    const { name , email , message  } = req.body;
    try {
        const response = {
            name,
            email,
            subject: 'message received by customer care',
            message: 'we will respond in 24hrs'
        };
        await sendEmail(response);
        const received = {
            name,
            email: process.env.USER || 'hngvoxclips@gmail.com',
            subject: 'user query',
            message
        };
        await sendEmail(received);
        res.send({
            success: true,
            msg: 'message sent'
        });
    } catch (err) {
        res.send({
            success: false,
            msg: 'message not sent'
        });
    }
};
