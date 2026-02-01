const mongoose = require('mongoose');

const LoginSchema = new mongoose.Schema({
  enrollment: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  last_login: { type: Date },
  role: { type: String, enum: ['student', 'admin'], required: true },
  is_approved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Login', LoginSchema);
