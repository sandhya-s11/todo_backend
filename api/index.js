const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('../Routes/authRoutes');
const route = require('../Routes/routes');

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'DB connection failed.', error: err.message });
  }
});

app.get('/status', (req, res) => res.json({ status: 'OK', message: 'Server is running.' }));
app.use('/auth', authRoute);
app.use('/tasks', route);

module.exports = app;
