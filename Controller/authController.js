const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');

const signToken = (user) =>
  jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const userResponse = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  department: user.department,
  year: user.year,
  age: user.age,
});

exports.register = async (req, res) => {
  try {
    const { username, password, year, department, email, age } = req.body;

    if (!username || !password || !department || !email || year == null || age == null)
      return res.status(400).json({ message: 'All fields are required.' });

    if (username.trim().length < 3)
      return res.status(400).json({ message: 'Username must be at least 3 characters.' });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: 'Invalid email format.' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const ageNum = Number(age);
    const yearNum = Number(year);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120)
      return res.status(400).json({ message: 'Age must be between 1 and 120.' });
    if (isNaN(yearNum) || yearNum < 1)
      return res.status(400).json({ message: 'Year must be a valid positive number.' });

    if (await User.findOne({ $or: [{ email }, { username }] }))
      return res.status(409).json({ message: 'Username or email already exists.' });

    const user = await User.create({
      username: username.trim(),
      password: await bcrypt.hash(password, 12),
      year: yearNum,
      department: department.trim(),
      email: email.toLowerCase().trim(),
      age: ageNum,
    });

    res.status(201).json({ message: 'Registered successfully.', token: signToken(user), user: userResponse(user) });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials.' });

    res.status(200).json({ message: 'Login successful.', token: signToken(user), user: userResponse(user) });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, year, department, email, age } = req.body;
    const updates = {};

    if (username) {
      if (username.trim().length < 3) return res.status(400).json({ message: 'Username must be at least 3 characters.' });
      updates.username = username.trim();
    }
    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Invalid email format.' });
      updates.email = email.toLowerCase().trim();
    }
    if (age != null && age !== '') {
      const n = Number(age);
      if (isNaN(n) || n < 1 || n > 120) return res.status(400).json({ message: 'Age must be between 1 and 120.' });
      updates.age = n;
    }
    if (year != null && year !== '') {
      const n = Number(year);
      if (isNaN(n) || n < 1) return res.status(400).json({ message: 'Year must be a valid positive number.' });
      updates.year = n;
    }
    if (department) updates.department = department.trim();

    if (!Object.keys(updates).length)
      return res.status(400).json({ message: 'Provide at least one field to update.' });

    if (updates.username || updates.email) {
      const conflict = await User.findOne({
        _id: { $ne: req.user.id },
        $or: [...(updates.username ? [{ username: updates.username }] : []), ...(updates.email ? [{ email: updates.email }] : [])],
      });
      if (conflict) return res.status(409).json({ message: 'Username or email already taken.' });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json({ message: 'User updated successfully.', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};
