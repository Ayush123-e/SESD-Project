import { Request, Response, NextFunction } from 'express';
import dashboardService, { DashboardService } from '../services/DashboardService';
import logRepository, { LogRepository } from '../repositories/LogRepository';

interface AuthReq extends Request {
  user?: any;
}

export class DashboardController {
  constructor(
    private service: DashboardService = dashboardService,
    private logRepo: LogRepository = logRepository
  ) {}

  public getAdminStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.service.getAdminStats();
      res.status(200).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  public getMemberStats = async (req: AuthReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new Error('Unauthenticated');
      const stats = await this.service.getMemberStats(req.user.id);
      res.status(200).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  public getAdminLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
       const logs = await this.logRepo.getRecentLogs(50);
       res.status(200).json({ status: 'success', data: logs });
    } catch (e) { next(e); }
  }
}

export default new DashboardController();
