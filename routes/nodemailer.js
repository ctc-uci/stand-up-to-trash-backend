const express = require('express');

const transporter = require('../transporter');

const emailRouter = express();

require('dotenv').config();

emailRouter.use(express.json());

emailRouter.post('/', (req, res) => {
  const { email, messageHtml, subjectName } = req.body;
  const mail = {
    from: process.env.REACT_APP_EMAIL_USERNAME,
    to: email,
    subject: subjectName,
    html: messageHtml,
  };

  transporter.sendMail(mail, (err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send('Success');
    }
  });
});

module.exports = emailRouter;
