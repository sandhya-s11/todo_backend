import express from 'express';
import { register, login, getUser, updateUser } from '../Controller/authController.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const authRoute = express.Router();

authRoute.post('/register', register);
authRoute.post('/login', login);
authRoute.get('/getuser', authMiddleware, getUser);
authRoute.patch('/updateuser', authMiddleware, updateUser);

export default authRoute;
