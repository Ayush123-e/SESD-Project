import { Request, Response, NextFunction } from 'express';
import borrowingService, { BorrowingService } from '../services/BorrowingService';

// Custom Auth Request bound loosely mappings
interface AuthReq extends Request {
  user?: any;
}

export class BorrowingController {
  constructor(private service: BorrowingService = borrowingService) {}

  public borrowBook = async (req: AuthReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new Error('Unauthenticated');
      const record = await this.service.borrowBook(req.user.id, req.body.bookId);
      res.status(201).json({
        status: 'success',
        data: record
      });
    } catch (error) {
      next(error);
    }
  }

  public returnBook = async (req: AuthReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new Error('Unauthenticated');
      const record = await this.service.returnBook(req.params.id as string, req.user.id, req.user.role);
      res.status(200).json({
        status: 'success',
        message: 'Book returned seamlessly',
        data: record
      });
    } catch (error) {
      next(error);
    }
  }

  public getMyBorrowingHistory = async (req: AuthReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new Error('Unauthenticated');
      const history = await this.service.getMyBorrowHistory(req.user.id);
      res.status(200).json({
        status: 'success',
        results: history.length,
        data: history
      });
    } catch (error) {
      next(error);
    }
  }

  public addToWaitlist = async (req: AuthReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new Error('Unauthenticated');
      const waitlist = await this.service.addToWaitlist(req.user.id, req.params.id as string);
      res.status(201).json({
        status: 'success',
        message: 'Successfully bounded onto the native waitlist queue.',
        data: waitlist
      });
    } catch (error) {
      next(error);
    }
  }

  public getAllBorrowingHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const history = await this.service.getAllBorrowHistory();
      res.status(200).json({
        status: 'success',
        results: history.length,
        data: history
      });
    } catch (error) {
      next(error);
    }
  }

  public getMyFines = async (req: AuthReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new Error('Unauthenticated');
      const fines = await this.service.getMyFines(req.user.id);
      res.status(200).json({
        status: 'success',
        results: fines.length,
        data: fines
      });
    } catch (error) {
      next(error);
    }
  }

  public getAllFines = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fines = await this.service.getAllFines();
      res.status(200).json({
        status: 'success',
        results: fines.length,
        data: fines
      });
    } catch (error) {
      next(error);
    }
  }

  public markFinePaid = async (req: AuthReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new Error('Unauthenticated');
      const record = await this.service.markFinePaid(req.params.id as string, req.user.id, req.user.role);
      res.status(200).json({
        status: 'success',
        message: 'Fine successfully cleared.',
        data: record
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BorrowingController();
