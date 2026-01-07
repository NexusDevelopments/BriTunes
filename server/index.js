const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/music', require('./routes/music'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/artists', require('./routes/artists'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BriTunes API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🎵 BriTunes server running on port ${PORT}`);
});
