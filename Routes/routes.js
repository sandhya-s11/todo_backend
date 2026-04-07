const express = require('express');
const { addToDo, getToDo, updateToDo, deleteToDo } = require('../Controller/controller');
const authMiddleware = require('../Middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/addtodo', addToDo);
router.get('/gettodo', getToDo);
router.patch('/updatetodo/:id', updateToDo);
router.delete('/deletetodo/:id', deleteToDo);

module.exports = router;
