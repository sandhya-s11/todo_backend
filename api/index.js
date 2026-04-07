import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from '../Routes/authRoutes.js';
import route from '../Routes/routes.js';

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// DB connect (cached for serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.get('/status', (req, res) => res.json({ status: 'OK', message: 'Server is running.' }));
app.use('/auth', authRoute);
app.use('/tasks', route);

export default app;
