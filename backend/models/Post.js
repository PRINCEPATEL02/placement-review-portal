const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  company_name: { type: String, required: true },
  role: { type: String },
  type: { type: String, enum: ['off campus', 'on campus'], required: true },
  steps: { type: String, required: true },
  level: { type: String, enum: ['hard', 'medium', 'easy'], required: true },
  tips: { type: String },
  comments: { type: String },
  author: { type: String }, // User's name or enrollment
  created_at: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }], // Array of enrollment numbers
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  views: { type: Number, default: 0 }
});

module.exports = mongoose.model('Post', PostSchema);
