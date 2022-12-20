"use strict";
const nodemailer = require('nodemailer');
//const User = require('../models/User'); //get user email from user model
const pug = require('pug');
const { convert  } = require('html-to-text');
require('dotenv').config();
module.exports = class Email {
    newTransport() {
        return nodemailer.createTransport({
            service: process.env.SERVICE || 'gmail',
            host: process.env.HOST || 'smtp.gmail.com',
            secre: false,
            auth: {
                user: process.env.USER || 'hngvoxclips@gmail.com',
                pass: process.env.PASS || 'kcxmkkumsafeeiur'
            }
        });
    }
    async send(template, subject) {
        // 1) Render HTML based on a pug template
        console.log(this.url);
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
        console.log(this.email);
        await this.send('video', 'your video link is here');
    }
    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
    }
    constructor(user, url){
        this.to = user.email;
        this.email = user.email;
        this.url = url;
        this.from = `voxclip <${process.env.EMAIL_FROM} || hngvoxclips@gmail.com>`;
    }
};
