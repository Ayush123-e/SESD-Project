import { Router } from 'express';
import authRoutes from './auth.routes';
import bookRoutes from './book.routes';
import borrowingRoutes from './borrowing.routes';
import spaceRoutes from './space.routes';
import dashboardRoutes from './dashboard.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Define robust base routes structure natively scoped
router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/borrowing', borrowingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/spaces', spaceRoutes);
router.use('/admin', adminRoutes);

// Basic health-check route securely typing bindings mapping explicitly
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running solidly mapped to robust OOP definitions.' });
});

export default router;
