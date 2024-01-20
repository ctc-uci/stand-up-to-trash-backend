/* eslint-disable camelcase */
const express = require('express');

const statsRouter = express.Router();
const pool = require('../server/db');

statsRouter.use(express.json());

statsRouter.put('/data/checkin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const allEvents = await pool.query(
      'UPDATE event_data SET is_checked_in= NOT is_checked_in WHERE id=$1',
      [id],
    );
    res.status(200).json(allEvents.rows);
  } catch (error) {
    res.json(error);
  }
});

module.exports = statsRouter;
