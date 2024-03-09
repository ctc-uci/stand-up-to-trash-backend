const express = require('express');

const firebaseRouter = express.Router();

const pool = require('../server/db');
const admin = require('../config/firebase-config');

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

firebaseRouter.delete('/delete-account/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    admin.auth().deleteUser(uid);
    const result = await pool.query(`DELETE FROM users WHERE firebase_uid = $1`, [uid]);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

firebaseRouter.post('/disable-account/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    admin.auth().updateUser(uid, { disabled: true });
    res.status(200).json({ message: 'Successful :3' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error disabling user', error: error.message });
  }
});

module.exports = firebaseRouter;
