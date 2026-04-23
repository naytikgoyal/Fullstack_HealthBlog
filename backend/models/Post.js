const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // The URL-friendly version of the title
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  category: { type: String, required: true },
  featuredImage: { type: String, default: 'https://via.placeholder.com/800x400' }, // Placeholder for now
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt dates
});

module.exports = mongoose.model('Post', postSchema);