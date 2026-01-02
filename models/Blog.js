import mongoose from 'mongoose';

/**
 * Blog Schema
 * Stores blog posts with reference to the user who created them
 */
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to User model
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
