/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
const express = require('express');

const statsRouter = express.Router();

const pool = require('../server/db');

statsRouter.use(express.json());

statsRouter.get('/', async (req, res) => {
  try {
    const response = await pool.query('SELECT SUM(pounds) FROM event_data');
    const totalTrash =
      response.rows[0].sum != null ? parseFloat(response.rows[0].sum).toFixed(1) : '0.00';
    res.json(totalTrash);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/participants', async (req, res) => {
  try {
    const response = await pool.query('SELECT SUM(number_in_party) FROM event_data');
    const totalParticipant =
      response.rows[0].sum != null ? parseFloat(response.rows[0].sum).toFixed(1) : '0.00';
    res.json(totalParticipant);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/leaderboard', async (req, res) => {
  try {
    const response = await pool.query(
      'SELECT e.volunteer_id, v.first_name AS volunteer_first_name, v.last_name AS volunteer_last_name, SUM(e.pounds) AS total_weight FROM event_data_new e INNER JOIN users v ON e.volunteer_id = v.id GROUP BY e.volunteer_id, v.first_name, v.last_name ORDER BY total_weight DESC LIMIT 3;',
    );
    res.json(response.rows);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/leaderboard/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await pool.query(
      'SELECT e.volunteer_id, v.first_name AS volunteer_first_name, v.last_name AS volunteer_last_name, SUM(e.pounds) AS total_weight FROM event_data_new e INNER JOIN users v ON e.volunteer_id = v.id WHERE e.event_id = $1 GROUP BY e.volunteer_id, v.first_name, v.last_name ORDER BY total_weight DESC LIMIT 3;',
      [eventId],
    );
    res.json(response.rows);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await pool.query(
      'SELECT SUM(pounds) FROM event_data_new WHERE event_id = $1',
      [eventId],
    );
    const totalTrash =
      response.rows[0].sum != null ? parseFloat(response.rows[0].sum).toFixed(1) : '0.00';
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
      response.rows[0].sum != null ? parseFloat(response.rows[0].sum).toFixed(1) : '0.00';
    res.json(totalTrash);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/register/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await pool.query(
      'SELECT SUM(number_in_party) FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE event_id = $1',
      [eventId],
    );
    const totalPeople =
      response.rows[0].sum != null ? parseFloat(response.rows[0].sum).toFixed(1) : '0.00';
    res.json(totalPeople);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/checkin/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const response = await pool.query(
      'SELECT SUM(number_in_party) FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE event_id = $1 and event_data.is_checked_in=true',
      [eventId],
    );
    const totalPeople =
      response.rows[0].sum != null ? parseFloat(response.rows[0].sum).toFixed(1) : '0.00';
    res.json(totalPeople);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/week', async (req, res) => {
  try {
    const response = await pool.query(
      `SELECT SUM(pounds) AS pound_sum, SUM(ounces) AS ounces_sum FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE`,
    );
    const pounds = response.rows[0].pound_sum != null ? parseFloat(response.rows[0].pound_sum) : 0;
    const ounces =
      response.rows[0].ounces_sum != null ? parseFloat(response.rows[0].ounces_sum) : 0;
    const total = (pounds + ounces / 16).toFixed();
    const response2 = await pool.query(
      `SELECT SUM(pounds) AS pound_sum, SUM(ounces) AS ounces_sum FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE - INTERVAL '14 days' AND CURRENT_DATE - INTERVAL '7 days'`,
    );
    const poundsTwo =
      response.rows[0].pound_sum != null ? parseFloat(response2.rows[0].pound_sum) : 0;
    const ouncesTwo =
      response.rows[0].ounces_sum != null ? parseFloat(response2.rows[0].ounces_sum) : 0;
    const totalTwo = poundsTwo + ouncesTwo / 16;
    let rate = '0.0';
    if (totalTwo != 0) {
      rate = (((total - totalTwo) / totalTwo) * 100).toFixed(1);
    } else if (total != 0) {
      rate = total.toFixed(1);
    }
    res.json(rate);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/year', async (req, res) => {
  try {
    const response = await pool.query(
      `SELECT SUM(pounds) AS pound_sum, SUM(ounces) AS ounces_sum FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE - INTERVAL '1 year' AND CURRENT_DATE`,
    );
    const pounds = response.rows[0].pounds_sum != null ? parseFloat(response.rows[0].pound_sum) : 0;
    const ounces =
      response.rows[0].ounces_sum != null ? parseFloat(response.rows[0].ounces_sum) : 0;
    const total = pounds + ounces / 16;

    const responseTwo = await pool.query(
      `SELECT SUM(pounds) AS pound_sum, SUM(ounces) AS ounces_sum FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE - INTERVAL '2 years' AND CURRENT_DATE - INTERVAL '1 year'`,
    );
    const poundsTwo =
      responseTwo.rows[0].pound_sum != null ? parseFloat(responseTwo.rows[0].pound_sum) : 0;
    const ouncesTwo =
      responseTwo.rows[0].ounces_sum != null ? parseFloat(responseTwo.rows[0].ounces_sum) : 0;
    const totalTwo = poundsTwo + ouncesTwo / 16;
    const rate = (totalTwo != 0 ? ((total - totalTwo) / totalTwo) * 100 : total).toFixed(1);
    res.json(rate);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/month', async (req, res) => {
  try {
    const response = await pool.query(
      `SELECT SUM(pounds) AS pound_sum, SUM(ounces) AS ounces_sum FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE - INTERVAL '1 month' AND CURRENT_DATE`,
    );
    const pounds = response.rows[0].pounds_sum != null ? parseFloat(response.rows[0].pound_sum) : 0;
    const ounces =
      response.rows[0].ounces_sum != null ? parseFloat(response.rows[0].ounces_sum) : 0;
    const total = pounds + ounces / 16;

    const responseTwo = await pool.query(
      `SELECT SUM(pounds) AS pound_sum, SUM(ounces) AS ounces_sum FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE - INTERVAL '2 months' AND CURRENT_DATE - INTERVAL '1 month' `,
    );
    const poundsTwo =
      responseTwo.rows[0].pound_sum != null ? parseFloat(responseTwo.rows[0].pound_sum) : 0;
    const ouncesTwo =
      responseTwo.rows[0].ounces_sum != null ? parseFloat(responseTwo.rows[0].ounces_sum) : 0;
    const totalTwo = poundsTwo + ouncesTwo / 16;
    const rate = (totalTwo != 0 ? (total - totalTwo) / totalTwo : total).toFixed(1);
    res.json(rate);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/participants/week', async (req, res) => {
  try {
    const response = await pool.query(
      `SELECT SUM(number_in_party) FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE`,
    );
    const total = response.rows[0].sum != null ? parseFloat(response.rows[0].sum) : 0;

    const response2 = await pool.query(
      `SELECT SUM(number_in_party) AS total FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE - INTERVAL '14 days' AND CURRENT_DATE - INTERVAL '7 days'`,
    );
    const total2 = response2.rows[0].sum != null ? parseFloat(response2.rows[0].sum) : 0;
    const rate = (total2 != 0 ? (total - total2) / total2 : total).toFixed(1);
    res.json(rate);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/participants/year', async (req, res) => {
  try {
    const response = await pool.query(
      `SELECT SUM(number_in_party) FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE - INTERVAL '1 year' AND CURRENT_DATE`,
    );
    const total = response.rows[0].sum != null ? parseFloat(response.rows[0].sum) : 0;

    const response2 = await pool.query(
      `SELECT SUM(number_in_party) FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE - INTERVAL '2 years' AND CURRENT_DATE - INTERVAL '1 year'`,
    );
    const total2 = response2.rows[0].sum != null ? parseFloat(response2.rows[0].sum) : 0;
    const rate = (total2 != 0 ? (total - total2) / total2 : total).toFixed(1);
    res.json(rate);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/participants/month', async (req, res) => {
  try {
    const response = await pool.query(
      `SELECT SUM(number_in_party) FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE - INTERVAL '1 month' AND CURRENT_DATE`,
    );
    const total = response.rows[0].sum != null ? parseFloat(response.rows[0].sum) : 0;

    const response2 = await pool.query(
      `SELECT SUM(number_in_party) FROM event_data INNER JOIN events on event_data.event_id=events.id WHERE events.date BETWEEN CURRENT_DATE - INTERVAL '3 months' AND CURRENT_DATE - INTERVAL '1 month' `,
    );
    const total2 = response2.rows[0].sum != null ? parseFloat(response2.rows[0].sum) : 0;
    const rate = (total2 != 0 ? (total - total2) / total2 : total).toFixed(1);
    res.json(rate);
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/registered', async (req, res) => {
  try {
    const response = await pool.query(`SELECT COUNT(*) FROM event_data`);
    const total = response.rows[0].count != null ? parseFloat(response.rows[0].count) : 0;
    res.json(total.toFixed(1));
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/checkedIn', async (req, res) => {
  try {
    const response = await pool.query(`SELECT COUNT(*) FROM event_data WHERE is_checked_in = true`);
    const total = response.rows[0].count != null ? parseFloat(response.rows[0].count) : 0;
    res.json(total.toFixed(1));
  } catch (err) {
    res.status(400).json(err);
  }
});

statsRouter.get('/total', async (req, res) => {
  try {
    const response = await pool.query(
      `SELECT SUM(pounds) AS pound_sum, SUM(ounces) AS ounces_sum FROM event_data`,
    );
    const pounds = response.rows[0].pounds_sum != null ? parseFloat(response.rows[0].pound_sum) : 0;
    const ounces =
      response.rows[0].ounces_sum != null ? parseFloat(response.rows[0].ounces_sum) : 0;
    const total = pounds + ounces / 16;
    res.json(total.toFixed(1));
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = statsRouter;
