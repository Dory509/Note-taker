const express = require('express');
const api = require('./routes/api.js'); // Ensure correct filename case
const html = require('./routes/html.js');
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Set up routes
app.use('/api', api); // Mount API routes under /api
app.use(html); // Mount HTML routes

// Start the server
app.listen(PORT, () =>
  console.log(`App is live on port ${PORT}. Access it via Render URL.`)
);