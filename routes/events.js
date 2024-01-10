const express = require('express');
// const { db } = require('../server/db');

const eventsRouter = express.Router();
const pool = require('../server/db');

eventsRouter.use(express.json());

eventsRouter.get('/', async (req, res) => {
  try {
    const allEvents = await pool.query('SELECT * FROM events');
    res.json(allEvents.rows);
  } catch (error) {
    res.json(error);
  }
});

eventsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await pool.query('SELECT * FROM events WHERE id =$1', [id]);
    res.json(event.rows[0]);
  } catch (error) {
    res.send(error);
  }
});

// need to fix here (check postman)
// post adds a new event
eventsRouter.post('/', async (req, res) => {
  try {
    const { name, description, location } = req.body;
    const newEvent = await pool.query(
      'INSERT INTO events (name, description, location) VALUES ($1, $2, $3) RETURNING *',
      [name, description, location],
    );
    res.json(newEvent.rows[0]);
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
    res.json(updatedEvent.rows[0]);
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
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted succesfully.', event: deleteEvent.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
});

module.exports = eventsRouter;
