const express = require('express');
const cors = require('cors'); // Import cors middleware
// const { db } = require('../server/db');
const pool = require('../server/db'); // Import the pool object for database connection

const dataRouter = express.Router();
dataRouter.use(cors({ credentials: true }));
// dataRouter.get('/', async (req, res) => {
//   const { id } = req.params;
//   const volunteerId = await pool.query(
//     `SELECT *
//     FROM event_data D
//     WHERE D.volunteer_id = ${id}`
//   );
//   console.log(volunteerId);
// });

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
