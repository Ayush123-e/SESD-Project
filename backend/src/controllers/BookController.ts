import { Request, Response, NextFunction } from 'express';
import bookService, { BookService } from '../services/BookService';

// Custom Request Mapping for JWT payloads
interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
  file?: any;
}

export class BookController {
  constructor(private service: BookService = bookService) {}

  public getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.getAllBooks(req.query);
      res.status(200).json({
        status: 'success',
        results: result.books.length,
        total: result.total,
        page: result.page,
        pages: result.pages,
        hasMore: result.hasMore,
        data: result.books
      });
    } catch (error) {
      next(error);
    }
  }

  public getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const book = await this.service.getBookById(req.params.id as string);
      res.status(200).json({
        status: 'success',
        data: book
      });
    } catch (error) {
      next(error);
    }
  }

  public createBook = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = { ...req.body };
      if (req.file) payload.coverImageUrl = req.file.path;
      const newBook = await this.service.createBook(payload);
      res.status(201).json({
        status: 'success',
        data: newBook
      });
    } catch (error) {
      next(error);
    }
  }

  public updateBook = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = { ...req.body };
      if (req.file) payload.coverImageUrl = req.file.path;
      const updatedBook = await this.service.updateBook(req.params.id as string, payload);
      res.status(200).json({
        status: 'success',
        data: updatedBook
      });
    } catch (error) {
      next(error);
    }
  }

  public getRecommendations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new Error('Unauthenticated natively');
      const recommendations = await this.service.getRecommendations(req.user.id);
      res.status(200).json({
        status: 'success',
        data: recommendations
      });
    } catch (e) {
      next(e);
    }
  }

  public deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.deleteBook(req.params.id as string);
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BookController();
