import mongoose from 'mongoose';

/**
 * User Schema for Authentication
 * Stores user credentials and basic information
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

const User = mongoose.model('User', userSchema);

export default User;
