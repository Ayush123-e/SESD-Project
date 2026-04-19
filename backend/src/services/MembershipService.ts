import { UserRepository } from '../repositories/UserRepository';
import AppError from '../utils/AppError';
import { IUser } from '../models/User';

export class MembershipService {
  constructor(
    private userRepository: UserRepository = new UserRepository()
  ) {}

  public getTierLimits(tier: string): { maxBooks: number; allowBooking: boolean } {
    const constraints: Record<string, { maxBooks: number; allowBooking: boolean }> = {
      'Free': { maxBooks: 1, allowBooking: false },
      'Standard': { maxBooks: 3, allowBooking: true },
      'Premium': { maxBooks: 10, allowBooking: true }
    };
    return constraints[tier] || constraints['Standard'];
  }

  public async upgradeMembership(userId: string, targetTier: 'Free' | 'Standard' | 'Premium'): Promise<IUser | null> {
    if (!['Free', 'Standard', 'Premium'].includes(targetTier)) {
       throw new AppError('Invalid mapping target natively over memberships', 400);
    }
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    const updatedUser = await this.userRepository.update(userId, {
       membershipTier: targetTier,
       membershipValidUntil: validUntil
    });
    return updatedUser;
  }
}

export default new MembershipService();
