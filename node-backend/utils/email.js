const nodemailer = require('nodemailer');
const User = require('../models/User'); //get user email from user model

//const sendEmail = async options => {

    //const transporter = nodemailer.createTransport({
/*         service:'gmail',
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        } */
    const Email = require('email-templates');
    const email = new Email({
        message: {
        from: 'shegzyrey<withlove@example.com>'
        },
        send: true,
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
            template: 'animatedVideo',
            message: {
            to: 'mentor <noreply@hng.com>'
            },
            locals: person
        })
        .then(console.log)
        .catch(console.error);
    })

//module.exports = sendEmail};