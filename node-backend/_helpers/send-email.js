const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = EMAIL_FROM }) {
    const transporter = nodemailer.createTransport(config.smtpOptions);
    await transporter.sendMail({ from, to, subject, html });
}