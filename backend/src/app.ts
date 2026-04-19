import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/AppError';
import routes from './routes';
import path from 'path';

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploads Publicly securely
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Routing (API)
app.use('/api', routes);

// 404 Route Not Found
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
