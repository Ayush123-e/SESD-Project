import { BookRepository } from '../repositories/BookRepository';
import { UserRepository } from '../repositories/UserRepository';
import { BorrowingRepository } from '../repositories/BorrowingRepository';
import { SpaceRepository } from '../repositories/SpaceRepository';
import { WaitlistRepository } from '../repositories/WaitlistRepository';
import { FineRepository } from '../repositories/FineRepository';

export class DashboardService {
  constructor(
    private bookRepository: BookRepository = new BookRepository(),
    private userRepository: UserRepository = new UserRepository(),
    private borrowingRepository: BorrowingRepository = new BorrowingRepository(),
    private spaceRepository: SpaceRepository = new SpaceRepository(),
    private waitlistRepository: WaitlistRepository = new WaitlistRepository(),
    private fineRepository: FineRepository = new FineRepository()
  ) {}

  public async getAdminStats(): Promise<any> {
    const totalBooks = await this.bookRepository.countTotalTitles();
    const borrowedBooks = await this.borrowingRepository.countAllActiveBorrows();
    const overdueBooks = await this.borrowingRepository.countAllOverdue();
    const totalMembers = await this.userRepository.countMembers();
    const spaces = await this.spaceRepository.findAllSpaces();
    const totalSpaces = spaces.length;
    const activeBookings = await this.spaceRepository.getActiveBookingsForSpace(null, new Date(0), new Date('2099-01-01')).catch(() => 0);

    return {
      totalBooks,
      borrowedBooks,
      overdueBooks,
      totalMembers,
      totalSpaces,
      activeBookings
    };
  }

  public async getMemberStats(userId: string): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;

    const activeBorrows = await this.borrowingRepository.findActiveBorrowsByUser(userId);
    const borrowedBooks = activeBorrows.length;
    const dueDates = activeBorrows.map(record => ({
      bookTitle: (record.book as any).title,
      borrowDate: record.borrowDate,
      dueDate: record.dueDate,
      isOverdue: record.status === 'OVERDUE' || record.dueDate < new Date(),
      recordId: record._id
    }));

    // Fetch fines safely via explicit Fine Repository dynamically
    const finesRecords = await this.borrowingRepository.findUnpaidFinesByUser(userId);
    const finesRecordsMappedOverFineRepo = await this.fineRepository.findAllUnpaidFines();
    let pendingFinesTotal = user.totalPendingFines || 0;

    const detailedFines = finesRecordsMappedOverFineRepo.filter(f => (f.borrowRecordId as any)?.user?.toString() === userId).map(f => {
       return {
         recordId: f.borrowRecordId,
         fineAmount: f.amount,
         status: 'UNPAID'
       }
    });

    const waitlistRecords = await this.waitlistRepository.getUserActiveWaitlist(userId);

    const allHistory = await this.borrowingRepository.findAllByUser(userId);
    const borrowHistoryCount = allHistory.length;
    
    const activeSpaceBookings = await this.spaceRepository.findUserActiveBookings(userId);
    const formattedSpaceBookings = activeSpaceBookings.map(b => ({
        id: b._id,
        spaceName: (b.space as any).name,
        startTime: b.startTime,
        endTime: b.endTime
    }));

    return {
      membershipTier: user.membershipTier,
      membershipValidUntil: user.membershipValidUntil,
      borrowedBooks,
      dueDates,
      pendingFinesTotal,
      detailedFines,
      borrowHistoryTotal: borrowHistoryCount,
      activeSpaceBookings: formattedSpaceBookings,
      waitlistCount: waitlistRecords.length,
      waitlistedBooks: waitlistRecords.map(w => ({ id: w._id, title: (w.book as any).title, status: w.status }))
    };
  }
}

export default new DashboardService();
