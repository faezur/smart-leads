import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler';
import leadRoutes from './routes/leadRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || '',
    'http://localhost:5173',
  ],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Smart Leads API is running' });
});

app.use('/api/leads', leadRoutes);

app.use(errorHandler);

// Start server
const startServer = (): void => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();

export default app;
