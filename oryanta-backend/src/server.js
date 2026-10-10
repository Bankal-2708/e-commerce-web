import 'dotenv/config';   // ← SABSE PEHLE, aur dotenv.config() ki zaroorat nahi

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL, // frntend url from .env
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Oryanta Backend API is running 🚀',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
const startServer = async () => {
  try {
    const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
    const missing = requiredEnv.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      console.error(`Missing required env vars: ${missing.join(', ')}`);
      process.exit(1);
    }

    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS allowed: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;