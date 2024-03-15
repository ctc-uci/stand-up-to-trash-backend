/* eslint-disable camelcase */
const express = require('express');

const dataRouter = express.Router();
const pool = require('../server/db');

require('dotenv').config();

dataRouter.use(express.json());

dataRouter.get('/', async (req, res) => {
  // Return all data from event_data_new table
  try {
    const events = await pool.query('SELECT * FROM event_data_new');
    res.status(200).json(events.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

dataRouter.get('/:id', async (req, res) => {
  // Returns data from event_data_new table with a given event_id
  try {
    const { id } = req.params;
    const events = await pool.query('SELECT * FROM event_data_new WHERE event_id =$1', [id]);

    res.status(200).json(events.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

dataRouter.post('/', async (req, res) => {
  // Add new event to event_data_new table, requires event info in body
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
      'INSERT INTO event_data_new ( volunteer_id, number_in_party, pounds, ounces, unusual_items, event_id, is_checked_in) VALUES ($1, $2, $3, $4, $5, $6, $7);';
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

dataRouter.post('/guestCheckin', async (req, res) => {
  // Add new event to event_data_new table, requires event info in body
  try {
    const { volunteer_id, event_id } = req.body;

    const postQuery =
      'INSERT INTO event_data_new ( volunteer_id, event_id, is_checked_in) VALUES ($1, $2, $3);';
    const eventData = [volunteer_id, event_id, false];
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
        'UPDATE event_data_new SET volunteer_id = $1, number_in_party = $2, pounds = $3, ounces = $4, unusual_items = $5, event_id = $6, is_checked_in = $7 WHERE id = $8';
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
    const delQuery = 'DELETE FROM event_data_new WHERE id = $1';
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
      FROM event_data_new D
      WHERE D.volunteer_id = $1`,
      [volunteerId],
    );
    res.status(200).json(volunteerData.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.get('/volunteer/:volunteerId/event', async (req, res) => {
  // retrive a list of event names associated with the volunteerID
  try {
    const { volunteerId } = req.params;
    const volunteerData = await pool.query(
      `SELECT E.name
      FROM event_data_new D
      INNER JOIN events E ON D.event_id = E.id
      WHERE D.volunteer_id = $1`,
      [volunteerId],
    );
    const eventNames = volunteerData.rows.map((row) => row.name);
    res.status(200).json(eventNames);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventData = await pool.query(
      `SELECT *
      FROM event_data_new D
      WHERE D.event_id = $1`,
      [eventId],
    );
    res.status(200).json(eventData.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.get('/volunteer/:volunteerId/event/:eventId', async (req, res) => {
  try {
    const { volunteerId, eventId } = req.params;
    const volAndEventData = await pool.query(
      `SELECT *
      FROM event_data_new D
      WHERE D.event_id = $1 AND D.volunteer_id = $2
      `,
      [eventId, volunteerId],
    );
    res.status(200).json(volAndEventData.rows);
  } catch (err) {
    // console.log(err);
    res.status(500).send(err.message);
  }
});

dataRouter.put('/checkin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const allEvents = await pool.query(
      `UPDATE event_data_new SET is_checked_in = NOT is_checked_in WHERE id = $1`,
      [id],
    );
    res.status(200).json(allEvents);
  } catch (error) {
    res.json(error);
  }
});

dataRouter.patch('/checkin/:eventId/:volunteerId', async (req, res) => {
  try {
    const { eventId, volunteerId } = req.params;
    await pool.query(
      `UPDATE event_data_new
      SET is_checked_in = NOT is_checked_in
      WHERE event_id = $1 AND volunteer_id = $2;`,
      [eventId, volunteerId],
    );

    res.status(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.post('/image/', async (req, res) => {
  try {
    const { s3_url } = req.body;
    const postQuery = 'INSERT INTO event_data_images (s3_url) VALUES ($1);';
    const eventData = [s3_url];
    const insertedStatus = await pool.query(postQuery, eventData);

    res.status(200).json(insertedStatus);
    // res.status(200).json("get-image: ", getStatus);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.get('/image/url/:s3URL', async (req, res) => {
  try {
    const { s3URL } = req.params;
    const getIDQuery = 'SELECT id FROM event_data_images WHERE s3_url = $1;';
    const eventData = [s3URL];
    const getStatus = await pool.query(getIDQuery, eventData);

    res.status(200).json(getStatus);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.put('/image/list/:id/:eventImageKey', async (req, res) => {
  try {
    const { id, eventImageKey } = req.params;
    const postQuery =
      'UPDATE event_data_new SET image_array = image_array || ARRAY[CAST ($2 AS INTEGER)] WHERE id = $1;';
    const eventData = [id, eventImageKey];
    const insertedStatus = await pool.query(postQuery, eventData);

    res.status(200).json(insertedStatus);
    // res.status(200).json("get-image: ", getStatus);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.delete('/image/:id', async (req, res) => {
  // Delete event by ID from the event_data_images table
  try {
    const { id } = req.params;
    const delQuery = 'DELETE FROM event_data_images WHERE id = $1';
    const delId = [id];
    const deleteStatus = await pool.query(delQuery, delId);
    res.status(200).send(deleteStatus);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.delete('/image/list/:id/:eventImageKey', async (req, res) => {
  // Delete event by ID from the event_data_images table
  try {
    const { id, eventImageKey } = req.params;
    const deleteStatus = await pool.query(
      `UPDATE event_data_new
      SET image_array = ARRAY_REMOVE(image_array, CAST ($2 AS INTEGER))
      WHERE id = $1;`,
      [id, eventImageKey],
    );
    res.status(200).send(deleteStatus);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.get('/image/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const events = await pool.query(
      `SELECT id, name, s3_url
      FROM (
        SELECT unnest_column
        FROM event_data_new, UNNEST(event_data_new.image_array) AS unnest_column
        WHERE event_data_new.id = $1
      ) AS image_ids
      JOIN event_data_images ON event_data_images.id = image_ids.unnest_column`,
      [eventId],
    );
    res.status(200).json(events.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

dataRouter.get('/images/:volunteerId', async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const result = await pool.query(
      `SELECT DISTINCT E.s3_url
      FROM event_data_new D
      JOIN LATERAL unnest(D.image_array) AS image_id ON true
      JOIN event_data_images E ON E.id = image_id
      WHERE D.volunteer_id = $1`,
      [volunteerId],
    );

    const imageUrls = result.rows.map((row) => row.s3_url);
    res.status(200).json(imageUrls);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = dataRouter;
