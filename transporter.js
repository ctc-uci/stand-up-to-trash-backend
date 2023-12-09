const nodemailer = require('nodemailer');

const transport = {
  service: 'gmail',
  auth: {
    user: process.env.REACT_APP_EMAIL_USERNAME,
    pass: process.env.REACT_APP_EMAIL_PASSWORD,
  },
  from: process.env.REACT_APP_EMAIL_USERNAME,
  secure: true,
  port: 465,
};

const transporter = nodemailer.createTransport(transport);

module.exports = transporter;
