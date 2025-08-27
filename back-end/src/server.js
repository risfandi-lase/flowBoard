// src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection test
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase JSON payload limit
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Also for form data

// Test database connection on startup
testConnection();

// Basic route to test server
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'FlowBoard API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  Users:`);
  console.log(`    GET    http://localhost:${PORT}/api/users`);
  console.log(`    POST   http://localhost:${PORT}/api/users`);
  console.log(`    GET    http://localhost:${PORT}/api/users/:id`);
  console.log(`    PUT    http://localhost:${PORT}/api/users/:id`);
  console.log(`    DELETE http://localhost:${PORT}/api/users/:id`);
  console.log(`  Projects:`);
  console.log(`    GET    http://localhost:${PORT}/api/projects`);
  console.log(`    POST   http://localhost:${PORT}/api/projects`);
  console.log(`    GET    http://localhost:${PORT}/api/projects/:id`);
  console.log(`    PUT    http://localhost:${PORT}/api/projects/:id`);
  console.log(`    DELETE http://localhost:${PORT}/api/projects/:id`);
  console.log(`    POST   http://localhost:${PORT}/api/projects/:id/members`);
  console.log(`  Tasks:`);
  console.log(`    GET    http://localhost:${PORT}/api/tasks?project_id=1`);
  console.log(`    POST   http://localhost:${PORT}/api/tasks`);
  console.log(`    GET    http://localhost:${PORT}/api/tasks/:id`);
  console.log(`    PUT    http://localhost:${PORT}/api/tasks/:id`);
  console.log(`    PATCH  http://localhost:${PORT}/api/tasks/:id/status`);
  console.log(`    DELETE http://localhost:${PORT}/api/tasks/:id`);
});