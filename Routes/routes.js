import express from 'express';
import { addToDo, getToDo, updateToDo, deleteToDo } from '../Controller/controller.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const route = express.Router();

route.use(authMiddleware); // all task routes require auth

route.post('/addtodo', addToDo);
route.get('/gettodo', getToDo);
route.patch('/updatetodo/:id', updateToDo);
route.delete('/deletetodo/:id', deleteToDo);

export default route;
