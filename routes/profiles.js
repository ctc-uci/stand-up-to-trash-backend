/* eslint-disable camelcase */
const express = require('express');

const profilesRouter = express.Router();

const pool = require('../server/db');

profilesRouter.use(express.json());

profilesRouter.post('/', async (req, res) => {
  try {
    const { first_name, last_name, role, email, firebase_uid } = req.body;
    const newProfile = await pool.query(
      'INSERT INTO users (first_name, last_name, role, email, firebase_uid) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [first_name, last_name, role, email, firebase_uid],
    );
    res.status(201).json(newProfile.rows[0]);
  } catch (error) {
    res.status(400).json(error);
  }
});

profilesRouter.get('/', async (req, res) => {
  try {
    const allProfiles = await pool.query('SELECT * FROM users');
    res.status(200).json(allProfiles.rows);
  } catch (error) {
    res.status(400).json(error);
  }
});

// grabs only admin role from profiles
profilesRouter.get('/admin', async (req, res) => {
  try {
    const allProfiles = await pool.query("SELECT * FROM users WHERE role='admin'");
    res.status(200).json(allProfiles.rows);
  } catch (error) {
    res.status(400).json(error);
  }
});

profilesRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    res.status(200).json(profile.rows[0]);
  } catch (error) {
    res.status(400).json(error);
  }
});

profilesRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, role, email } = req.body;
    const updateProfile = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, role = $3, email = $4 WHERE id = $5 RETURNING *',
      [first_name, last_name, role, email, id],
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
    const deleteProfileResult = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [
      id,
    ]);

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
