const express = require('express');
// const { db } = require('../server/db');

const eventsRouter = express.Router();
const pool = require('../server/db');

eventsRouter.use(express.json());

// GET /events  Returns all event rows in the events table where it is not archived
eventsRouter.get('/', async (req, res) => {
  try {
    const allEvents = await pool.query(
      'SELECT * FROM events WHERE is_archived = false ORDER BY date DESC',
    );
    res.status(200).json(allEvents.rows);
  } catch (error) {
    res.json(error);
  }
});

// GET /events/joined  Retreives all the data joined together
eventsRouter.get('/joined', async (req, res) => {
  try {
    const allEvents = await pool.query(
      'SELECT event_data_new.id AS event_data_new_id, * FROM event_data_new INNER JOIN events ON events.id = event_data_new.event_id INNER JOIN users ON users.id = event_data_new.volunteer_id',
    );
    res.status(200).json(allEvents.rows);
  } catch (error) {
    res.json(error);
  }
});

// GET /events/joined/:id  Retreives all the data joined together
eventsRouter.get('/joined/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const allEvents = await pool.query(
      'SELECT event_data_new.id AS event_data_new_id, * FROM event_data_new INNER JOIN events ON events.id = event_data_new.event_id INNER JOIN users ON users.id = event_data_new.volunteer_id WHERE events.id = $1',
      [id],
    );
    res.status(200).json(allEvents.rows);
  } catch (error) {
    res.json(error);
  }
});

eventsRouter.get('/archiveEvents', async (req, res) => {
  try {
    const allEvents = await pool.query(
      'SELECT * FROM events WHERE is_archived = true ORDER BY date DESC',
    );
    res.status(200).json(allEvents.rows);
  } catch (error) {
    res.json(error);
  }
});

// PUT /events/:id/archive  Sets an event's is_archived field to true
eventsRouter.put('/archive/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Update the event's is_archived field to true
    const archivedEvent = await pool.query(
      'UPDATE events SET is_archived = true WHERE id = $1 RETURNING *',
      [id],
    );
    if (archivedEvent.rowCount === 0) {
      res.status(404).json({ message: 'Event not found' });
      return; // Ensure function exits after sending response
    }
    res.status(200).json({ message: 'Event archived successfully.', event: archivedEvent.rows[0] });
  } catch (error) {
    res.json({ message: 'Error archiving event', error: error.message });
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
    const { name, description, location, imageUrl, date, time, waiver } = req.body;
    const newEvent = await pool.query(
      'INSERT INTO events (name, description, location, image_url, waiver, date, time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, location, imageUrl, waiver, date, time],
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
