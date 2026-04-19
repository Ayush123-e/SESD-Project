import { SpaceRepository } from '../repositories/SpaceRepository';
import { UserRepository } from '../repositories/UserRepository';
import { MembershipService } from './MembershipService';
import { LogRepository } from '../repositories/LogRepository';
import AppError from '../utils/AppError';
import { IStudySpace } from '../models/StudySpace';
import { ISeatBooking } from '../models/SeatBooking';

export class SpaceService {
  constructor(
    private spaceRepository: SpaceRepository = new SpaceRepository(),
    private userRepository: UserRepository = new UserRepository(),
    private membershipService: MembershipService = new MembershipService(),
    private logRepository: LogRepository = new LogRepository()
  ) {}

  public async createSpace(data: Partial<IStudySpace>): Promise<IStudySpace> {
    return await this.spaceRepository.createSpace(data);
  }

  public async getAllSpaces(): Promise<IStudySpace[]> {
    return await this.spaceRepository.findAllSpaces();
  }

  public async bookSeat(userId: string, spaceId: string, startTime: string, endTime: string): Promise<ISeatBooking> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError('User not found natively.', 404);

    const limits = this.membershipService.getTierLimits(user.membershipTier);
    if (!limits.allowBooking) throw new AppError('Your current membership tier strictly prevents explicit Study Space accesses natively.', 403);

    const space = await this.spaceRepository.findSpaceById(spaceId);
    if (!space) throw new AppError('Study Zone boundary not found.', 404);
    if (space.status !== 'active') throw new AppError('This zone is under maintenance.', 400);

    const sDate = new Date(startTime);
    const eDate = new Date(endTime);
    if (eDate <= sDate) throw new AppError('End time must follow Start time explicitly', 400);

    const durationHours = (eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60);
    if (durationHours > 4) throw new AppError('Strict limits prohibit bookings exceeding 4 hours locally.', 400);

    const activeCount = await this.spaceRepository.getActiveBookingsForSpace(spaceId, sDate, eDate);
    if (activeCount >= space.capacity) {
       throw new AppError('Zone capacity maxed! No explicit seats remain during your time slot natively.', 400);
    }

    const booking = await this.spaceRepository.createBooking({
      user: userId as any, space: spaceId as any, startTime: sDate, endTime: eDate
    });

    this.logRepository.createLog('SEAT_BOOKED', `Locked Study Space natively.`, userId, null);
    return booking;
  }

  public async getMyBookings(userId: string): Promise<ISeatBooking[]> {
    return await this.spaceRepository.findUserActiveBookings(userId);
  }
}

export default new SpaceService();
