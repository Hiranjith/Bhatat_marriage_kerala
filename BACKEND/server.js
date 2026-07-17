import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// SCALABILITY & SECURITY MIDDLEWARES
// ==========================================

// 1. Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet());

// 2. Compress all responses for performance
app.use(compression());

// 3. Rate limiting to prevent brute-force and DDoS attacks
// Limits each IP to 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

// 4. Standard Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to match frontend URL in production
  credentials: true
}));
app.use(express.json()); // Built-in body parser
app.use(cookieParser());

// ==========================================
// ROUTES
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Optimized backend server running on port ${PORT}`);
});
