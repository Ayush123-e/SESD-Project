import { Router } from 'express';
import spaceController from '../controllers/SpaceController';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.use(requireAuth);

router.post('/book', spaceController.bookSeat);
router.get('/my-bookings', spaceController.getMyBookings);
router.get('/', spaceController.getAllSpaces);

router.use(requireRole('LIBRARIAN'));
router.post('/', spaceController.createSpace);

export default router;
