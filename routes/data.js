/* eslint-disable camelcase */
const express = require('express');

const dataRouter = express.Router();
const db = require('../server/db');

require('dotenv').config();

dataRouter.use(express.json());

dataRouter.get('/', async (req, res) => {
  // Reutn all data from volunteers table
  try {
    const volunteers = await db.query('SELECT * FROM volunteers');
    res.status(200).send(volunteers.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.post('/', async (req, res) => {
  // Add new volunteer to volunteers table, requires volunteer info in body
  try {
    const { id, email, first_name, last_name } = req.body;
    const postQuery =
      'INSERT INTO volunteers (id, email, first_name, last_name) VALUES ($1, $2, $3, $4);';
    const volunteerData = [id, email, first_name, last_name];
    const insertedStatus = await db.query(postQuery, volunteerData);
    res.status(200).send(insertedStatus);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.put('/:id', async (req, res) => {
  // Update volunteer data by ID
  try {
    const { email, first_name, last_name } = req.body;
    // Data to update passed through body, data not to be updated left blank
    const { id } = req.params;
    // ID passed as parameter

    if (id == null) {
      // ID must be passed
      res.status(400).send('Invalid ID');
    } else {
      let putQuery = 'UPDATE volunteers SET ';
      let paramater_num = 1;
      const parameterValues = [];
      if (id === undefined) {
        res.status(500);
      }
      if (email !== undefined) {
        // Update email if it is defined in body
        putQuery += `email = $${paramater_num} `;
        parameterValues.push(email);
        paramater_num += 1;
      }
      if (first_name !== undefined) {
        // Update first_name if it is defined in the body
        if (paramater_num > 1) {
          putQuery += ', ';
        }
        putQuery += `first_name = $${paramater_num} `;
        parameterValues.push(first_name);
        paramater_num += 1;
      }
      if (last_name !== undefined) {
        // Update last_name if it is defined in body
        if (paramater_num > 1) {
          putQuery += ', ';
        }
        putQuery += `last_name = $${paramater_num} `;
        parameterValues.push(last_name);
        paramater_num += 1;
      }

      putQuery += `WHERE id = $${paramater_num}`;
      parameterValues.push(id);
      const inserted = await db.query(putQuery, parameterValues);
      res.status(200).send(inserted);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.delete('/:id', async (req, res) => {
  // Delete volunteer by ID
  try {
    const { id } = req.params;
    const delQuery = 'DELETE FROM volunteers WHERE id = $1';
    const delId = [id];

    const deleteStatus = await db.query(delQuery, delId);
    res.status(200).send(deleteStatus);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = dataRouter;
