const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/students.routes');
const teacherRoutes = require('./routes/teachers.routes');
const newsRoutes = require('./routes/news.routes');
const galleryRoutes = require('./routes/gallery.routes');
const eventRoutes = require('./routes/events.routes');
const admissionRoutes = require('./routes/admissions.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const timetableRoutes = require('./routes/timetable.routes');
const settingsRoutes = require('./routes/settings.routes');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Mpendae School API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/settings', settingsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
