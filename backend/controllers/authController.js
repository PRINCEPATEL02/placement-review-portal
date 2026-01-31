const Login = require('../models/Login');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
  const { enrollment, email, password, role, first_name, last_name, middle_name } = req.body;

  if (!enrollment || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingLogin = await Login.findOne({ $or: [{ enrollment }, { email }] });
    if (existingLogin) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newLogin = new Login({
      enrollment,
      email,
      password: hashedPassword,
      role
    });

    await newLogin.save();

    const newUser = new User({
      enrollment, // Link via enrollment string
      first_name: first_name || '',
      last_name: last_name || '',
      middle_name: middle_name || '',
      email_id: email, // Initial email
      role
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await Login.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    user.last_login = Date.now();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role, enrollment: user.enrollment }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.json({ token, user: { enrollment: user.enrollment, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ enrollment: req.user.enrollment });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  const { first_name, last_name, middle_name, email_id } = req.body;

  try {
    const user = await User.findOne({ enrollment: req.user.enrollment });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (middle_name) user.middle_name = middle_name;
    if (email_id) {
      user.email_id = email_id;
      // Also update login email for consistency?
      await Login.findOneAndUpdate({ enrollment: req.user.enrollment }, { email: email_id });
    }

    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
