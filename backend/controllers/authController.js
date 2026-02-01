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
  const { enrollment, password } = req.body;

  if (!enrollment || !password) {
    return res.status(400).json({ message: 'Enrollment Number and password are required' });
  }

  try {
    const user = await Login.findOne({ enrollment });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    user.last_login = Date.now();
    user.save().catch(err => console.error("Error updating last_login:", err)); // Don't await this

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

// Forgot Password - Send New Credentials
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Login.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User with this email does not exist' });

    // 1. Generate new temporary password
    const tempPassword = Math.random().toString(36).slice(-8); // 8 char random string

    // 2. Hash it
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 3. Update User
    user.password = hashedPassword;
    await user.save();

    // 4. Send Email
    const sendEmail = require('../utils/sendEmail');

    const message = `Your account credentials have been reset.\n\nEnrollment: ${user.enrollment}\nEmail: ${user.email}\nTemporary Password: ${tempPassword}\n\nPlease login and change your password immediately.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Placement Portal - Credentials Recovery',
        message: message
      });

      res.json({ message: 'New credentials sent to your email.' });
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      // If email fails, technically we should probably rollback the password change or warn user.
      // For simplicity/safety, we tell them it failed.
      return res.status(500).json({ message: 'Email could not be sent. Please contact admin.' });
    }

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    // Find login record
    const user = await Login.findOne({ enrollment: req.user.enrollment });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    res.json({ message: 'Password updated successfully' });

  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
