import { Router } from 'express';
import dashboardController from '../controllers/DashboardController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.get('/member/stats', dashboardController.getMemberStats);

// Admin Dashboards mapping bounds explicitly
router.use(requireRole('LIBRARIAN'));
router.get('/admin/stats', dashboardController.getAdminStats);
router.get('/admin/logs', dashboardController.getAdminLogs);

export default router;
