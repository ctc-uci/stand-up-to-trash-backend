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

statsRouter.get('/week', async (req, res) => {
  try {
    const response = await pool.query(
      `SELECT SUM(pounds) AS pound_sum, SUM(ounces) AS ounces_sum FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE AND CURRENT_DATE - INTERVAL '7 days'`,
    );
    const pounds = parseFloat(response.rows[0].pound_sum);
    const ounces = parseFloat(response.rows[0].ounces_sum);
    const total = pounds + ounces / 16;
    res.json(total);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/year', async (req, res) => {
  try {
    const response = await pool.query(
      `SELECT SUM(pounds) AS pound_sum, SUM(ounces) AS ounces_sum FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE AND CURRENT_DATE - INTERVAL '1 year'`,
    );
    const pounds = parseFloat(response.rows[0].pound_sum);
    const ounces = parseFloat(response.rows[0].ounces_sum);
    const total = pounds + ounces / 16;

    const responseTwo = await pool.query(
      `SELECT SUM(pounds) AS pound_sum, SUM(ounces) AS ounces_sum FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE - INTERVAL '1 year' AND CURRENT_DATE - INTERVAL '2 years'`,
    );
    const poundsTwo = parseFloat(responseTwo.rows[0].pound_sum);
    const ouncesTwo = parseFloat(responseTwo.rows[0].ounces_sum);
    const totalTwo = poundsTwo + ouncesTwo / 16;
    const rate = (totalTwo - total) / total;
    res.json(rate);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/month', async (req, res) => {
  try {
    const response = await pool.query(
      `SELECT SUM(pounds) AS pound_sum, SUM(ounces) AS ounces_sum FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE AND CURRENT_DATE - INTERVAL '1 month'`,
    );
    const pounds = parseFloat(response.rows[0].pound_sum);
    const ounces = parseFloat(response.rows[0].ounces_sum);
    const total = pounds + ounces / 16;

    const responseTwo = await pool.query(
      `SELECT SUM(pounds) AS pound_sum, SUM(ounces) AS ounces_sum FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE - INTERVAL '1 month' AND CURRENT_DATE - INTERVAL '3 months'`,
    );
    const poundsTwo = parseFloat(responseTwo.rows[0].pound_sum);
    const ouncesTwo = parseFloat(responseTwo.rows[0].ounces_sum);
    const totalTwo = poundsTwo + ouncesTwo / 16;
    const rate = (totalTwo - total) / total;
    res.json(rate);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = statsRouter;
