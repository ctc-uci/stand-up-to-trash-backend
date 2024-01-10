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
    console.log('id', volunteerId);
    const volunteer = await pool.query(`SELECT * FROM event_data D WHERE D.volunteer_id == $1 `, [
      volunteerId,
    ]);
    res.status(200).json(volunteer);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

dataRouter.get('/event/:eventId', async (req, res) => {
  try {
    const { id } = req.params;
    const eventId = await pool.query(
      `SELECT *
      FROM event_data D
      WHERE D.event_id == $(id)
      `,
      {
        id,
      },
    );
    res.status(200).send(eventId);
  } catch (err) {
    // console.log(err);
    res.status(500).send(err.message);
  }
});

dataRouter.get('/volunteer/:volunteerId/event/:eventId', async (req, res) => {
  try {
    const { volunteerId, eventId } = req.params;
    const volAndEventID = await pool.query(
      `SELECT *
      FROM event_data D
      WHERE D.event_id == $(eventId) AND D.volunteer_id == $(volunteerID)
      `,
      {
        volunteerId,
        eventId,
      },
    );
    res.status(200).send(volAndEventID);
  } catch (err) {
    // console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = dataRouter;
