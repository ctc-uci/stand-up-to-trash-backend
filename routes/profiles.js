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
    res.json(newProfile.rows[0]);
  } catch (error) {
    res.json(error);
  }
});

profilesRouter.get('/', async (req, res) => {
  try {
    const allProfiles = await pool.query('SELECT * FROM volunteers');
    res.json(allProfiles.rows);
  } catch (error) {
    res.json(error);
  }
});

profilesRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await pool.query('SELECT * FROM volunteers WHERE id = $1', [id]);
    res.json(profile.rows[0]);
  } catch (error) {
    res.json(error);
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
    res.json(updateProfile.rows[0]);
  } catch (error) {
    res.json(error);
  }
});

module.exports = profilesRouter;
