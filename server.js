import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

/**
 * MERN Blog Application - Backend Server
 * 
 * This is the main entry point for the backend API.
 * It handles MongoDB connection, middleware setup, and route registration.
 */

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// ========================================
// MIDDLEWARE CONFIGURATION
// ========================================
app.use(cors());  // Enable CORS for frontend communication
app.use(express.json());  // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies

// ========================================
// MONGODB CONNECTION
// ========================================
/**
 * Connect to MongoDB Atlas database
 * Uses MONGODB_URI environment variable for connection string
 * This function is called AFTER the server starts listening
 */
const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined. Please set it in Railway/Render dashboard or .env file.');
    }

    // Log that connection is being attempted (without exposing credentials)
    console.log('🔄 Attempting to connect to MongoDB...');
    
    // Connect to MongoDB with recommended options
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('💡 Make sure to set MONGODB_URI environment variable in Railway/Render dashboard');
    // Don't exit process - let server continue running for health checks
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// ========================================
// API ROUTES
// ========================================
app.use('/api/auth', authRoutes);  // Authentication routes (signup, login)
app.use('/api/blogs', blogRoutes);  // Blog CRUD routes

// Root route - Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Blog API is running successfully! 🚀',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// ========================================
// ERROR HANDLING MIDDLEWARE
// ========================================
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong on the server!', 
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message 
  });
});

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

// ========================================
// START SERVER
// ========================================
const PORT = process.env.PORT || 5000;

// Start server first, then connect to MongoDB (Railway-compatible approach)
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('⏳ Server started successfully, now connecting to MongoDB...');
  
  // Connect to MongoDB after server starts (prevents build-time connection issues)
  connectDB();
});
