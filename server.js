import connectDB from './Db/db.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import route from './Routes/routes.js';
import authRoute from './Routes/authRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }));
app.use(express.json());

// Server status
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running.', timestamp: new Date() });
});

app.use('/auth', authRoute);
app.use('/tasks', route);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
