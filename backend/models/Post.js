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
  enrollment: { type: String }, // User's Enrollment Number
  approved_by_email: { type: String }, // Admin's Email ID
  created_at: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }], // Array of enrollment numbers
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  views: { type: Number, default: 0 }
});

// Indexes for performance
PostSchema.index({ status: 1, created_at: -1 });
PostSchema.index({ enrollment: 1 });
PostSchema.index({ company_name: 'text' }); // Text search capability

module.exports = mongoose.model('Post', PostSchema);
