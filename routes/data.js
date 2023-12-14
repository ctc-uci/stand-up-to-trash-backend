const express = require('express');

const dataRouter = express.Router();
const db = require('../server/db');

require('dotenv').config();

dataRouter.use(express.json());

dataRouter.get('/', async (req, res) => {
  try {
    // May or may not work, waiting for DB to work
    const volunteers = await db.db.query('SELECT * FROM volunteers');
    res.status(200).send(volunteers.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.post('/', async (req, res) => {
  try {
    // Does not work, waiting for DB to work
    const { id, email, firstName, lastName } = req.body;
    const volunteer = {
      id,
      email,
      first_name: firstName,
      last_name: lastName,
    };
    // console.log(volunteers);
    // const volunteers = await db.db.query('SELECT * FROM volunteers');
    res.status(200).send(volunteer);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = dataRouter;
