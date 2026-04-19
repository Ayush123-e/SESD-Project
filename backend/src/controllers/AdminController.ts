import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { LogRepository } from '../repositories/LogRepository';
import AppError from '../utils/AppError';

export class AdminController {
  constructor(
    private userRepository: UserRepository = new UserRepository(),
    private logRepository: LogRepository = new LogRepository()
  ) {}

  public getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userRepository.find({});
      res.status(200).json({
        status: 'success',
        results: users.length,
        data: users
      });
    } catch (e) {
      next(e);
    }
  }

  public updateUserTier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { membershipTier, role } = req.body;
      
      const updatedUser = await this.userRepository.update(id, { membershipTier, role });
      if (!updatedUser) throw new AppError('User not found.', 404);

      this.logRepository.createLog('USER_UPDATED', `Admin updated user ${id} tiers/roles.`, (req as any).user.id);
      
      res.status(200).json({
        status: 'success',
        data: updatedUser
      });
    } catch (e) {
      next(e);
    }
  }

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.userRepository.delete(id);
      if (!success) throw new AppError('User not found.', 404);

      this.logRepository.createLog('USER_DELETED', `Admin purged user ${id} from system tracing.`, (req as any).user.id);

      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (e) {
      next(e);
    }
  }

  public getSystemAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Placeholder for real aggregation logic
        const totalLogs = await this.logRepository.find({});
        res.status(200).json({
            status: 'success',
            data: {
                logCount: totalLogs.length,
                lastActivity: totalLogs[0]?.createdAt
            }
        });
    } catch (e) {
        next(e);
    }
  }
}

export default new AdminController();
