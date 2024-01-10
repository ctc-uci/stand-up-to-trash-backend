/* eslint-disable camelcase */
const express = require('express');

const dataRouter = express.Router();
const db = require('../server/db');

require('dotenv').config();

dataRouter.use(express.json());

dataRouter.get('/', async (req, res) => {
  // Return all data from event_data table
  try {
    const events = await db.query('SELECT * FROM event_data');
    res.status(200).send(events.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.post('/', async (req, res) => {
  // Add new event to event_data table, requires event info in body
  try {
    const {
      id,
      volunteer_id,
      number_in_party,
      pounds,
      ounces,
      unusual_items,
      event_id,
      is_checked_in,
    } = req.body;
    const postQuery =
      'INSERT INTO event_data (id, volunteer_id, number_in_party, pounds, ounces, unusual_items, event_id, is_checked_in) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);';
    const eventData = [
      id,
      volunteer_id,
      number_in_party,
      pounds,
      ounces,
      unusual_items,
      event_id,
      is_checked_in,
    ];
    const insertedStatus = await db.query(postQuery, eventData);
    res.status(200).send(insertedStatus);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.put('/:id', async (req, res) => {
  // Update event data by ID
  try {
    const {
      volunteer_id,
      number_in_party,
      pounds,
      ounces,
      unusual_items,
      event_id,
      is_checked_in,
    } = req.body;
    // Data to update passed through body
    const { id } = req.params;
    // ID passed as parameter

    if (id === undefined) {
      // ID must be passed
      res.status(400).send('Invalid ID');
    } else {
      const putQuery =
        'UPDATE event_data SET volunteer_id = $1, number_in_party = $2, pounds = $3, ounces = $4, unusual_items = $5, event_id = $6, is_checked_in = $7 WHERE id = $8';
      const parameterValues = [
        volunteer_id,
        number_in_party,
        pounds,
        ounces,
        unusual_items,
        event_id,
        is_checked_in,
        id,
      ];
      const inserted = await db.query(putQuery, parameterValues);
      res.status(200).send(inserted);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.delete('/:id', async (req, res) => {
  // Delete event by ID
  try {
    const { id } = req.params;
    const delQuery = 'DELETE FROM event_data WHERE id = $1';
    const delId = [id];
    const deleteStatus = await db.query(delQuery, delId);
    res.status(200).send(deleteStatus);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = dataRouter;
