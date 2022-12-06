const nodemailer = require('nodemailer');
const User = require('../models/User'); //get user email from user model
const Email = require('email-templates');

const sendEmail = async options => {

    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth:{
            user: '385347a8cac45c',
            pass:'318b8146500b7e'
        }
    });

    const mailOptions = {
        from: 'name <tivicky98@gmail.com>',
        to: options.email,
        subject: options.subject ,
        text: options.message,
        /*  attachments: [{
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
    

    //const transporter = nodemailer.createTransport({
/*         service:'gmail',
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        } */
   /*  const email = new Email({
        message: {
        from: 'shegzyrey<withlove@voxclips.com>'
        },
        send: true,
        preview: false,
        transport: {    
            host: "smtp.mailtrap.io",
            port: 2525,
            ssl: false,
            tls: true,
            auth: {
                user: "385347a8cac45c",
                pass: "318b8146500b7e"
            }
        }
    });
    const people = [
        {firstName: 'ifihan', lastName: 'Jovialcore'},
        {firstName: 'Naza', lastName: 'Chandan'}
       ];
    people.forEach((person) => {
        email
        .send({
            template: 'animateVideo',
            message: {
            to: 'mentor <noreply@hng.com>'
            },
            locals: person
        })
        .then(console.log)
        .catch(console.error);
    }) */

module.exports = sendEmail