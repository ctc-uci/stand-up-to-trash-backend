const express = require('express');
const cors = require('cors');
const emailRouter = require('./routes/nodemailer');
const dataRouter = require('./routes/data');
const eventsRouter = require('./routes/events');
const profilesRouter = require('./routes/profiles');
require('dotenv').config();

const pool = require('./server/db'); // Import the pool object for database connection

const app = express();

const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`,
    credentials: true,
  }),
);

// EXAMPLE
app.get('/test', async (req, res) => {
  try {
    const lbData = await pool.query('SELECT * FROM volunteers');
    res.json(lbData.rows);
  } catch (error) {
    console.log(error);
  }
});

app.use('/send', emailRouter);
app.use('/data', dataRouter);
app.use('/events', eventsRouter);
app.use('/profiles', profilesRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
