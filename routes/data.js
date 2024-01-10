/* eslint-disable camelcase */
const express = require('express');

const dataRouter = express.Router();
const db = require('../server/db');

require('dotenv').config();

dataRouter.use(express.json());

dataRouter.get('/', async (req, res) => {
  try {
    const volunteers = await db.query('SELECT * FROM volunteers');
    res.status(200).send(volunteers.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.post('/', async (req, res) => {
  try {
    const { id, email, first_name, last_name } = req.body;
    const postQuery =
      'INSERT INTO volunteers (id, email, first_name, last_name) VALUES ($1, $2, $3, $4);';
    const volunteer = [id, email, first_name, last_name];
    const inserted = await db.query(postQuery, volunteer);
    res.status(200).send(inserted);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = dataRouter;
