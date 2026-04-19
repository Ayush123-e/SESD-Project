import { Router } from 'express';
import borrowingController from '../controllers/BorrowingController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

// Base Member scope explicit natively
router.post('/', borrowingController.borrowBook);
router.post('/waitlist/:id', borrowingController.addToWaitlist); // Id = Book Id structurally
router.get('/history', borrowingController.getMyBorrowingHistory);
router.get('/fines', borrowingController.getMyFines);
router.patch('/return/:id', borrowingController.returnBook); // Id = Record Id natively
router.patch('/fines/:id/pay', borrowingController.markFinePaid);

// Elevated Admin Routes explicit tracking natively
router.use(requireRole('LIBRARIAN'));
router.get('/history/all', borrowingController.getAllBorrowingHistory);
router.get('/fines/all', borrowingController.getAllFines);

export default router;
