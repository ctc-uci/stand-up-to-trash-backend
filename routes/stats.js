/* eslint-disable camelcase */
const express = require('express');

const statsRouter = express.Router();
// const pool = require('../server/db');
statsRouter.use(express.json());

statsRouter.get('/', async (req, res) => {
  res.send('hehe');
});

module.exports = statsRouter;
