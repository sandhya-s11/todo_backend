import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Model/userModel.js';

// POST /auth/register
export const register = async (req, res) => {
  try {
    const { username, password, year, department, email, age } = req.body;

    if (!username || !password || !department || !email || year === undefined || year === null || age === undefined || age === null) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (typeof username !== 'string' || username.trim().length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      return res.status(400).json({ message: 'Age must be a valid number between 1 and 120.' });
    }

    const yearNum = Number(year);
    if (isNaN(yearNum) || yearNum < 1) {
      return res.status(400).json({ message: 'Year must be a valid positive number.' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username: username.trim(),
      password: hashedPassword,
      year: yearNum,
      department: department.trim(),
      email: email.toLowerCase().trim(),
      age: ageNum,
    });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        department: user.department,
        year: user.year,
        age: user.age,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        department: user.department,
        year: user.year,
        age: user.age,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// GET /auth/getuser
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// PATCH /auth/updateuser
export const updateUser = async (req, res) => {
  try {
    const { username, year, department, email, age } = req.body;

    if (!username && !year && !department && !email && !age) {
      return res.status(400).json({ message: 'Provide at least one field to update.' });
    }

    const updates = {};

    if (username) {
      if (username.trim().length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters.' });
      }
      updates.username = username.trim();
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
      }
      updates.email = email.toLowerCase().trim();
    }

    if (age !== undefined && age !== null && age !== '') {
      const ageNum = Number(age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        return res.status(400).json({ message: 'Age must be between 1 and 120.' });
      }
      updates.age = ageNum;
    }

    if (year !== undefined && year !== null && year !== '') {
      const yearNum = Number(year);
      if (isNaN(yearNum) || yearNum < 1) {
        return res.status(400).json({ message: 'Year must be a valid positive number.' });
      }
      updates.year = yearNum;
    }

    if (department) updates.department = department.trim();

    // Check uniqueness conflicts
    if (updates.username || updates.email) {
      const conflict = await User.findOne({
        _id: { $ne: req.user.id },
        $or: [
          ...(updates.username ? [{ username: updates.username }] : []),
          ...(updates.email ? [{ email: updates.email }] : []),
        ],
      });
      if (conflict) {
        return res.status(409).json({ message: 'Username or email already taken.' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User updated successfully.', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};
