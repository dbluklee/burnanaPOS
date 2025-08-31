import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BurnanaPOS API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🍌 BurnanaPOS API server running on port ${PORT}`);
});

export default app;