const nodemailer = require('nodemailer');
//const User = require('../models/User'); //get user email from user model
const pug = require('pug');
const { convert } = require('html-to-text');
//const dotenv = require('dotenv');
//dotenv.config({ path: './../.env' });
require('dotenv').config();




module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.email = user.email;
        this.url = url;
        this.from = `voxclip <${process.env.EMAIL_FROM}`;
    }

newTransport() {
   /*  if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    } */

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      email: this.email,
      url: this.url,
      subject
    });

    // 2) Define email options
    const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: convert(html)
      };
  

        // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
}

async sendVideo() {
    await this.send('video', 'your video link is here');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};

/* const sendEmail = async options => {
    try {
    var transporter = nodemailer.createTransport({
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
        text: options.message, */
/*         attachments: [{
            filename: "${ User }.mp4",
            path: file_path
        }] */
   // };

/*     await transporter.sendEmail(mailOptions, (error, info)=> {
        if(error){
            console.log("Error in sending mail", error)
        }
        else{
            console.log('Email sent: ' + info.response)
        } 
    });
    } catch (error) {
        res.status(400).send({success:false,msg:"ch"});
      }
};
 */
