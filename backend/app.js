const express = require('express');
const cors = require('cors');
const path = require('path');
const setupSwagger = require('./swagger');
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const borrowingRoutes = require('./routes/borrowingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/books', authMiddleware, bookRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);
app.use('/api/borrowings', authMiddleware, borrowingRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
