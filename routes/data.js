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

dataRouter.put('/:id', async (req, res) => {
  try {
    const { id, email, first_name, last_name } = req.body;
    if (id == null) {
      res.status(400).send('Invalid ID');
    } else {
      /* const putQuery =
        'UPDATE volunteers SET email = $1, first_name = $2, last_name = $3 WHERE id = $4;'; */
      let putQuery = 'UPDATE volunteers SET ';
      const update_volunteer = [email, first_name, last_name, id];
      let num = 1;
      const values = [];
      if (id == null) {
        res.status(500);
      }
      if (email !== null) {
        putQuery += `email = $${num} `;
        values.push(email);
        num += 1;
      }
      if (first_name !== null) {
        if (num > 1) {
          putQuery += ', ';
        }
        putQuery += `first_name = $${num} `;
        values.push(first_name);
        num += 1;
      }
      if (last_name !== null) {
        if (num > 1) {
          putQuery += ', ';
        }
        putQuery += `last_name = $${num} `;
        values.push(last_name);
        num += 1;
      }

      putQuery += `WHERE id = $${num}; `;
      const inserted = await db.query(putQuery, update_volunteer);
      res.status(200).send(inserted);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = dataRouter;
