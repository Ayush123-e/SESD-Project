import { BorrowingRepository } from '../repositories/BorrowingRepository';
import { BookRepository } from '../repositories/BookRepository';
import { WaitlistRepository } from '../repositories/WaitlistRepository';
import { UserRepository } from '../repositories/UserRepository';
import { LogRepository } from '../repositories/LogRepository';
import { FineRepository } from '../repositories/FineRepository';
import { EmailService } from './EmailService';
import { MembershipService } from './MembershipService';
import AppError from '../utils/AppError';
import { IBorrowingRecord } from '../models/BorrowingRecord';

export class BorrowingService {
  constructor(
    private borrowingRepository: BorrowingRepository = new BorrowingRepository(),
    private bookRepository: BookRepository = new BookRepository(),
    private waitlistRepository: WaitlistRepository = new WaitlistRepository(),
    private userRepository: UserRepository = new UserRepository(),
    private logRepository: LogRepository = new LogRepository(),
    private emailService: EmailService = new EmailService(),
    private membershipService: MembershipService = new MembershipService(),
    private fineRepository: FineRepository = new FineRepository()
  ) {}

  public async borrowBook(userId: string, bookId: string): Promise<IBorrowingRecord> {
    const fullUser = await this.userRepository.findById(userId);
    if (!fullUser) throw new AppError('User missing', 404);

    // UML STRICT OVERRIDE: Fixed maximum items to EXACTLY 3 statically across Members.
    const activeCount = await this.borrowingRepository.countActiveBorrowsByUser(userId);
    if (activeCount >= 3) {
      throw new AppError(`Borrow limit reached! Your role restricts bounds explicitly to exactly 3 max structurally across all logic mappings.`, 400);
    }

    const book = await this.bookRepository.findById(bookId);
    if (!book) throw new AppError('Could not locate book catalog entry.', 404);

    const duplicateBorrow = await this.borrowingRepository.findActiveBorrowByUserAndBook(userId, bookId);
    if (duplicateBorrow) {
      throw new AppError('You are currently borrowing this book. Return it before checking it out again.', 400);
    }

    if (book.availableQuantity <= 0) {
      throw new AppError('This book is currently out of stock.', 400);
    }

    const pendingQueue = await this.waitlistRepository.getFirstPending(bookId);
    if (pendingQueue && pendingQueue.status === 'notified') {
      if ((pendingQueue.user as any)._id.toString() !== userId) {
         throw new AppError('Book bounds exceptionally locked explicitly to another waitlist trace locally.', 400);
      } else {
         await this.waitlistRepository.updateStatus(pendingQueue.id, 'fulfilled');
      }
    }

    const updatedBook = await this.bookRepository.update(bookId, {
      availableQuantity: book.availableQuantity - 1,
      borrowCount: (book.borrowCount || 0) + 1
    });

    if (!updatedBook) throw new AppError('Failed database transaction syncing checkout.', 500);

    const borrowDate = new Date();
    const dueDate = new Date();
    // UML STRICT BOUND: Automatically mapped 14 days offset dynamically instead of 7
    dueDate.setDate(borrowDate.getDate() + 14);

    const record = await this.borrowingRepository.create({
      user: userId as any,
      book: bookId as any,
      borrowDate,
      dueDate,
      status: 'BORROWED' // Uppercase UML Enum requirement
    });

    this.emailService.sendBorrowConfirmation(fullUser, book, dueDate);
    this.logRepository.createLog('BORROW', `Member scoped book checkout correctly.`, userId, bookId);

    return record;
  }

  public async returnBook(recordId: string, userId: string, userRole: string): Promise<IBorrowingRecord> {
    const record = await this.borrowingRepository.findById(recordId);
    if (!record) {
      throw new AppError('Borrowing record not found', 404);
    }

    if (userRole !== 'LIBRARIAN' && (record.user as any)._id.toString() !== userId.toString()) {
      throw new AppError('Strict restriction: Authorized access preventing returning books not in your possession.', 403);
    }

    if (record.status === 'RETURNED') {
      throw new AppError('This copy has already been checked-in.', 400);
    }

    const returnDate = new Date();
    let fineAmount = 0;

    if (returnDate > record.dueDate) {
      const diffTime = Math.abs(returnDate.getTime() - record.dueDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fineAmount = diffDays * 10;

      await this.userRepository.update((record.user as any)._id || record.user, { $inc: { totalPendingFines: fineAmount } });
      
      // UML Strict Mapping: Generate standalone Fine Object linking via FK dynamically recursively
      await this.fineRepository.create({
         borrowRecordId: record._id as any,
         amount: fineAmount,
         isPaid: false
      });
    }

    const updatedRecord = await this.borrowingRepository.update(recordId, {
      returnDate,
      status: 'RETURNED'
    });
    if (!updatedRecord) throw new AppError('Record trace failed internally', 500);

    const book = await this.bookRepository.findById((record.book as any)._id || record.book);
    if (book) {
      book.availableQuantity += 1;
      await book.save();

      const firstPending = await this.waitlistRepository.getFirstPending(book.id);
      if (firstPending) {
         await this.waitlistRepository.updateStatus(firstPending.id, 'notified', new Date());
         const firstUser = await this.userRepository.findById((firstPending.user as any)._id.toString());
         if (firstUser) this.emailService.sendWaitlistNotification(firstUser, book);
         this.logRepository.createLog('WAITLIST_NOTIFY', `Notified visual bounds explicitly securely.`, (firstPending.user as any)._id, book.id);
      }

      this.logRepository.createLog('RETURN', `Member returned scope traces dynamically.`, (record.user as any)._id, book.id);
    }

    return updatedRecord;
  }

  public async getMyBorrowHistory(userId: string): Promise<IBorrowingRecord[]> {
    return await this.borrowingRepository.findAllByUser(userId);
  }

  public async getAllBorrowHistory(): Promise<IBorrowingRecord[]> {
    return await this.borrowingRepository.findAll();
  }

  public async getMyFines(userId: string): Promise<any[]> {
    const fines = await this.borrowingRepository.findUnpaidFinesByUser(userId);
    // Deprecated logical mapping -> Should ping FineRepo moving forward inside endpoints
    return fines;
  }

  public async getAllFines(): Promise<any[]> {
    // Forward dynamically to actual Fine Schema native evaluation rules
    return await this.fineRepository.findAllUnpaidFines();
  }

  public async addToWaitlist(userId: string, bookId: string): Promise<any> {
    const book = await this.bookRepository.findById(bookId);
    if (!book) throw new AppError('Book instance absent', 404);
    if (book.availableQuantity > 0) throw new AppError('Book bounds physically available now natively. No waitlist bounded!', 400);

    const activeWaitlist = await this.waitlistRepository.getUserActiveWaitlist(userId);
    const alreadyWaitlisted = activeWaitlist.find(w => (w.book as any)._id.toString() === bookId);
    if (alreadyWaitlisted) throw new AppError('You securely trace a queue bound already.', 400);

    const record = await this.waitlistRepository.addToWaitlist(userId, bookId);
    this.logRepository.createLog('WAITLIST_JOIN', `Joined waitlist bounds systematically`, userId, bookId);
    return record;
  }

  public async markFinePaid(recordId: string, userId: string, userRole: string): Promise<any> {
    const record = await this.borrowingRepository.findById(recordId);
    if (!record) {
        throw new AppError('Record not found', 404);
    }
    if (userRole !== 'LIBRARIAN' && (record.user as any)._id.toString() !== userId.toString()) {
        throw new AppError('Unauthorized fine clearance intercept', 403);
    }
    
    // Evaluate standalone fine bounds recursively tracking natively
    const fineRec = await this.fineRepository.getByRecordId(recordId);
    if (!fineRec || fineRec.isPaid) {
        throw new AppError('This record holds no active fines to clear.', 400);
    }

    await this.userRepository.update((record.user as any)._id || record.user, { $inc: { totalPendingFines: -fineRec.amount } });
    
    return await this.fineRepository.update((fineRec._id as any).toString(), {
        isPaid: true,
        paidDate: new Date()
    });
  }
}

export default new BorrowingService();
