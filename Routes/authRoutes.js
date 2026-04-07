const express = require('express');
const { register, login, getUser, updateUser } = require('../Controller/authController');
const authMiddleware = require('../Middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getuser', authMiddleware, getUser);
router.patch('/updateuser', authMiddleware, updateUser);

module.exports = router;
