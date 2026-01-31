const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  enrollment: { type: String, ref: 'Login', unique: true, required: true },
  first_name: { type: String },
  last_name: { type: String },
  middle_name: { type: String },
  email_id: { type: String }, // Can be changed by user
  role: { type: String }
});

module.exports = mongoose.model('User', UserSchema);
