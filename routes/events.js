const express = require('express');
// const { db } = require('../server/db');

const eventsRouter = express.Router();
const pool = require('../server/db');

eventsRouter.use(express.json());

// GET /events  Returns all event rows in the events table
eventsRouter.get('/', async (req, res) => {
  try {
    const allEvents = await pool.query('SELECT * FROM events');
    res.status(200).json(allEvents.rows);
  } catch (error) {
    res.json(error);
  }
});

// GET /events/:id  Returns the corresponding event row based on id
eventsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await pool.query('SELECT * FROM events WHERE id =$1', [id]);
    res.status(200).json(event.rows[0]);
  } catch (error) {
    res.send(error);
  }
});

// POST /events  Creates a new event row in the events table
eventsRouter.post('/', async (req, res) => {
  try {
    const { name, description, location } = req.body;
    const newEvent = await pool.query(
      'INSERT INTO events (name, description, location) VALUES ($1, $2, $3) RETURNING *',
      [name, description, location],
    );
    res.status(200).json(newEvent.rows[0]);
  } catch (error) {
    res.json(error);
  }
});

// PUT/PATCH /events/:id  Edits the columns associated with the corresponding event row based on id
eventsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location } = req.body;
    const updatedEvent = await pool.query(
      'UPDATE events SET name = $1, description = $2, location = $3 WHERE id = $4 RETURNING *',
      [name, description, location, id],
    );
    res.status(200).json(updatedEvent.rows[0]);
  } catch (error) {
    res.json(error);
  }
});

// DELETE /events/:id  Deletes the corresponding event row based on id
eventsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteEvent = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

    if (deleteEvent.rowCount === 0) {
      res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted succesfully.', event: deleteEvent.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
});

module.exports = eventsRouter;