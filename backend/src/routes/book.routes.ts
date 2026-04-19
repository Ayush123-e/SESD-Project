import { Router } from 'express';
import bookController from '../controllers/BookController';
import { requireAuth, requireRole } from '../middlewares/auth';
import upload from '../middlewares/upload';

const router = Router();

// Public Routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Protected Auth bindings
router.use(requireAuth);
router.get('/recommendations/me', bookController.getRecommendations);

// Admin Only protected routes mapping explicitly natively
router.use(requireRole('LIBRARIAN'));
router.post('/', upload.single('coverImage'), bookController.createBook);
router.patch('/:id', upload.single('coverImage'), bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

export default router;
