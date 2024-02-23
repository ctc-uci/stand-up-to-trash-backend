/* eslint-disable camelcase */
const express = require('express');

const profilesRouter = express.Router();

const pool = require('../server/db');

profilesRouter.use(express.json());

profilesRouter.post('/', async (req, res) => {
  try {
    const { first_name, last_name, role, email, firebase_uid, imageUrl } = req.body;
    const queryValues = [first_name, last_name, role, email, firebase_uid];
    let query = 'INSERT INTO users (first_name, last_name, role, email, firebase_uid';

    if (imageUrl !== undefined) {
      query += ', image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      queryValues.push(imageUrl);
    } else {
      query += ') VALUES ($1, $2, $3, $4, $5) RETURNING *';
    }

    const newProfile = await pool.query(query, queryValues);
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
    const allProfiles = await pool.query("SELECT * FROM users WHERE LOWER(role) = 'admin'");
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
    const { first_name, last_name, role, email, imageUrl } = req.body;
    const updateProfile = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, role = $3, email = $4, image_url = $5 WHERE id = $6 RETURNING *',
      [first_name, last_name, role, email, imageUrl, id],
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
