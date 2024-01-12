/* eslint-disable camelcase */
const express = require('express');

const dataRouter = express.Router();
const pool = require('../server/db');

require('dotenv').config();

dataRouter.use(express.json());

dataRouter.get('/', async (req, res) => {
  // Return all data from event_data table
  try {
    const events = await pool.query('SELECT * FROM event_data');
    res.status(200).json(events.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

dataRouter.post('/', async (req, res) => {
  // Add new event to event_data table, requires event info in body
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

    const postQuery =
      'INSERT INTO event_data ( volunteer_id, number_in_party, pounds, ounces, unusual_items, event_id, is_checked_in) VALUES ($1, $2, $3, $4, $5, $6, $7);';
    const eventData = [
      volunteer_id,
      number_in_party,
      pounds,
      ounces,
      unusual_items,
      event_id,
      is_checked_in,
    ];
    const insertedStatus = await pool.query(postQuery, eventData);
    res.status(200).json(insertedStatus);
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
      const inserted = await pool.query(putQuery, parameterValues);
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
    const deleteStatus = await pool.query(delQuery, delId);
    res.status(200).send(deleteStatus);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.get('/volunteer/:volunteerId', async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const volunteerData = await pool.query(
      `SELECT *
      FROM event_data D
      WHERE D.volunteer_id = $1`,
      [volunteerId],
    );
    res.status(200).send(volunteerData);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

dataRouter.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventData = await pool.query(
      `SELECT *
      FROM event_data D
      WHERE D.event_id = $1`,
      [eventId],
    );
    res.status(200).send(eventData);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

dataRouter.get('/volunteer/:volunteerId/event/:eventId', async (req, res) => {
  try {
    const { volunteerId, eventId } = req.params;
    const volAndEventData = await pool.query(
      `SELECT *
      FROM event_data D
      WHERE D.event_id = $1 AND D.volunteer_id = $2
      `,
      [eventId, volunteerId],
    );
    res.status(200).send(volAndEventData);
  } catch (err) {
    // console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = dataRouter;
