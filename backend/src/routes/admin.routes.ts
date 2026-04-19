import { Router } from 'express';
import adminController from '../controllers/AdminController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

// Shield all admin routes with LIBRARIAN authority
router.use(requireAuth);
router.use(requireRole('LIBRARIAN'));

router.get('/users', adminController.getAllUsers);
router.patch('/users/:id', adminController.updateUserTier);
router.delete('/users/:id', adminController.deleteUser);
router.get('/analytics', adminController.getSystemAnalytics);

export default router;
