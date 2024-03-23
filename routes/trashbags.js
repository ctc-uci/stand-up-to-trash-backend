const express = require('express');

const trashBagsRouter = express.Router();
const pool = require('../server/db');

trashBagsRouter.use(express.json());

// GET /events  Returns all event rows in the events table where it is not archived
trashBagsRouter.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM trash_bags';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving data from trash_bags table:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

trashBagsRouter.get('/:eventDataKey', async (req, res) => {
  try {
    const { eventDataKey } = req.params;
    const query = 'SELECT * FROM trash_bags WHERE event_data_key = $1';
    const result = await pool.query(query, [eventDataKey]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving data from trash_bags table:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

trashBagsRouter.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const query = 'SELECT * FROM event_data_new WHERE event_id = $1';
    const result = await pool.query(query, [eventId]);
    const eventDataKeys = result.rows.map((row) => row.id);
    const trashBagsQuery = 'SELECT * FROM trash_bags WHERE event_data_key = ANY($1)';
    const trashBagsResult = await pool.query(trashBagsQuery, [eventDataKeys]);
    res.json(trashBagsResult.rows);
  } catch (error) {
    console.error('Error retrieving data from trash_bags table:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

trashBagsRouter.put('/:eventDataId', async (req, res) => {
  try {
    const { eventDataId } = req.params;
    const { trashBags } = req.body;
    const deleteQuery = 'DELETE FROM trash_bags WHERE event_data_key = $1';
    const insertQuery =
      'INSERT INTO trash_bags (event_data_key, pounds) VALUES ($1, $2) RETURNING *';
    const results = [];

    // Delete previous trash bags with the same event_data_key
    await pool.query(deleteQuery, [eventDataId]);

    // Insert new trash bags
    await Promise.all(
      trashBags.map(async (bag) => {
        const result = await pool.query(insertQuery, [eventDataId, bag]);
        results.push(result.rows[0]);
      }),
    );

    res.json(results);
  } catch (error) {
    console.error('Error adding data to trash_bags table:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = trashBagsRouter;
