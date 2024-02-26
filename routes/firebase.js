const express = require('express');

const firebaseRouter = express.Router();

const pool = require('../server/db');

firebaseRouter.get('/:firebaseUID', async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    const result = await pool.query(`SELECT * FROM users WHERE firebase_uid = $1`, [firebaseUID]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error getting profile', error: error.message });
  }
});

module.exports = firebaseRouter;
