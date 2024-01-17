const express = require('express');
const cors = require('cors');

require('dotenv').config();

const dataRouter = require('./routes/data');
const emailRouter = require('./routes/nodemailer');
const eventsRouter = require('./routes/events');
const profilesRouter = require('./routes/profiles');
const statsRouter = require('./routes/stats');

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
    console.error(error.message);
  }
});

app.use('/send', emailRouter);
app.use('/data', dataRouter);
app.use('/events', eventsRouter);
app.use('/profiles', profilesRouter);
app.use('/stats', statsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
