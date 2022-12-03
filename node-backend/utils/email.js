const nodemailer = require('nodemailer');
const User = require('../models/User'); //get user email from user model

const sendEmail = async options => {

    var transporter = nodemailer.createTransport({
/*         service:'gmail',
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        } */
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: 'shegzyrey <withlove@hng.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
/*         attachments: [{
            filename: "${ User }.mp4",
            path: file_path
        }] */
    };

    await transporter.sendEmail(mailOptions, (error, info)=> {
        if(error){
            console.log("Error in sending mail", error)
        }
        else{
            console.log('Email sent: ' + info.response)
        } 
    });
};

module.exports = sendEmail;