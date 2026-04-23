// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Explicitly allow Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json()); // Allows us to parse JSON data from the frontend

// Basic test route
const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);
// backend/server.js (Add this below your postRoutes)

app.post('/api/login', (req, res) => {
  // We are hardcoding the password as "admin123" for the college project
  const { password } = req.body;
  
  if (password === 'admin123') {
    res.json({ success: true, message: 'Welcome Admin!' });
  } else {
    res.status(401).json({ success: false, message: 'Incorrect password' });
  }
});
app.get('/', (req, res) => {
  res.send('Health Blog API is running!');
});

// Database connection & Server start
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB database successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });