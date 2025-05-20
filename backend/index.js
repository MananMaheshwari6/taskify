const express = require('express');
const cors = require('cors');
const { connectToDB } = require('./database');
const userRoutes = require('./routes/user');
const todoRoutes = require('./routes/todo');
require('dotenv').config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectToDB();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON requests

// Routes
app.use('/', userRoutes); // Auth routes (/signup, /signin)
app.use('/todo', todoRoutes); // Todo routes (/todo, /todo/:id)

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Taskify API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
