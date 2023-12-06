const express = require('express');
const { db } = require('../server/db');

const dataRouter = express.Router();

// dataRouter.get('/', (req, res) => {
//   console.log(db);
//   res.send(db);
// });

dataRouter.get('/volunteer/:volunteerId', async (req, res) => {
  try {
    const { id } = req.params;
    const volunteerId = await db.query(
      `SELECT *
    FROM events_data D
    WHERE D.volunteer_id == $(id) `,
      {
        id,
      },
    );
    res.status(200).send(volunteerId);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

dataRouter.get('/event/:eventId', async (req, res) => {
  try {
    const { id } = req.params;
    const eventId = await db.query(
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
    const volAndEventID = await db.query(
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
