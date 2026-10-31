require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const categoriesRoutes = require('./routes/categories.routes');
const locationsRoutes = require('./routes/locations.routes');
const eventsRoutes = require('./routes/events.routes');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());

// Friendly guard: if nobody has run the seed script yet, every API call
// would otherwise fail with a confusing file-not-found error.
app.use((req, res, next) => {
  if (!fs.existsSync(DB_PATH)) {
    return res.status(503).json({
      error: 'Database not initialized. Run "npm run seed" in the backend folder first.',
    });
  }
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'campusconnect-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/events', eventsRoutes);

// 404 for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`CampusConnect backend running on http://localhost:${PORT}`);
});
