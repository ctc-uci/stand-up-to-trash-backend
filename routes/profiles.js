/* eslint-disable camelcase */
const express = require('express');

const profilesRouter = express.Router();

const pool = require('../server/db');

profilesRouter.use(express.json());

profilesRouter.post('/', async (req, res) => {
  try {
    const { id, email, first_name, last_name } = req.body;
    const newProfile = await pool.query(
      'INSERT INTO volunteers (id, email, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, email, first_name, last_name],
    );
    res.status(201).json(newProfile.rows[0]);
  } catch (error) {
    res.status(400).json(error);
  }
});

profilesRouter.get('/', async (req, res) => {
  try {
    const allProfiles = await pool.query('SELECT * FROM volunteers');
    res.status(200).json(allProfiles.rows);
  } catch (error) {
    res.status(400).json(error);
  }
});

profilesRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await pool.query('SELECT * FROM volunteers WHERE id = $1', [id]);
    res.status(200).json(profile.rows[0]);
  } catch (error) {
    res.status(400).json(error);
  }
});

profilesRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name } = req.body;
    const updateProfile = await pool.query(
      'UPDATE volunteers SET email = $1, first_name = $2, last_name = $3 WHERE id = $4 RETURNING *',
      [email, first_name, last_name, id],
    );
    res.status(200).json(updateProfile.rows[0]);
  } catch (error) {
    res.json(error);
  }
});

// eslint-disable-next-line consistent-return
profilesRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProfileResult = await pool.query(
      'DELETE FROM volunteers WHERE id = $1 RETURNING *',
      [id],
    );

    if (deleteProfileResult.rowCount === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res
      .status(200)
      .json({ message: 'Profile deleted successfully', profile: deleteProfileResult.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting profile', error: error.message });
  }
});

module.exports = profilesRouter;
