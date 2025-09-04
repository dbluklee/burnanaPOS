import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { initializeDatabase } from './models/database';
import placesRouter from './routes/places';
import logsRouter from './routes/logs';
import usersRouter from './routes/users';
import tablesRouter from './routes/tables';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', usersRouter);
app.use('/api/places', placesRouter);
app.use('/api/tables', tablesRouter);
app.use('/api/logs', logsRouter);

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BurnanaPOS API is running' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize PostgreSQL database
    await initializeDatabase();
    console.log('✅ PostgreSQL database initialized successfully');
    
    // Start server - bind to all interfaces for tablet access
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🍌 BurnanaPOS API server running on port ${PORT}`);
      console.log(`🌐 Server accessible at:`);
      console.log(`   - Local: http://localhost:${PORT}`);
      console.log(`   - Network: http://192.168.50.89:${PORT}`);
      console.log(`📊 Database: PostgreSQL on ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}`);
      console.log(`📋 Database name: ${process.env.DB_NAME || 'burnana_pos'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Make sure PostgreSQL is running and accessible');
    process.exit(1);
  }
};

startServer();

export default app;