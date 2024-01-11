const express = require('express');
const pool = require('../server/db');

const dataRouter = express.Router();

dataRouter.use(express.json());

dataRouter.get('/', async (req, res) => {
  const volunteer = await pool.query(`SELECT * FROM event_data`);
  res.status(200).json(volunteer);
});

dataRouter.get('/volunteer/:volunteerId', async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const volunteerData = await pool.query(
      `SELECT *
      FROM event_data D
      WHERE D.volunteer_id = $1`,
      [volunteerId]
    );
    res.status(200).send(volunteerData);
    console.log(volunteerData);
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
      [eventId]
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
    console.log(volAndEventData);
  } catch (err) {
    // console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = dataRouter;
