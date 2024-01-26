/* eslint-disable camelcase */
const express = require('express');

const statsRouter = express.Router();

const pool = require('../server/db');

statsRouter.use(express.json());

statsRouter.get('/', async (req, res) => {
  try {
    const response = await pool.query('SELECT SUM(pounds) FROM event_data');
    const totalTrash =
      response.rows[0].sum != null ? parseFloat(response.rows[0].sum).toFixed(2) : '0.00';
    res.json(totalTrash);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await pool.query('SELECT SUM(pounds) FROM event_data WHERE event_id = $1', [
      eventId,
    ]);
    const totalTrash =
      response.rows[0].sum != null ? parseFloat(response.rows[0].sum).toFixed(2) : '0.00';
    res.json(totalTrash);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/volunteer/:volunteerId', async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const response = await pool.query(
      'SELECT SUM(pounds) FROM event_data WHERE volunteer_id = $1',
      [volunteerId],
    );
    const totalTrash =
      response.rows[0].sum != null ? parseFloat(response.rows[0].sum).toFixed(2) : '0.00';
    res.json(totalTrash);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = statsRouter;
