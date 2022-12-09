 const nodemailer = require('nodemailer');
require('dotenv').config(); 


const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
   // host: process.env.HOST,
//secure:false,
    auth: {
    user: process.env.USER,
    pass: process.env.PASS
    }
});

  // 2) Define the email options
  const mailOptions = {
    from: 'customer care <hngvoxclips@gmail.com>',
    to: options.email,
    //name: options.name,
    subject: options.subject,
    text: `${options.name} \n${options.message}`,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;