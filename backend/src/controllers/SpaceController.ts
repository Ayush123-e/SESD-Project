import { Request, Response, NextFunction } from 'express';
import spaceService, { SpaceService } from '../services/SpaceService';

interface AuthReq extends Request {
  user?: any;
}

export class SpaceController {
  constructor(private service: SpaceService = spaceService) {}

  public createSpace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const space = await this.service.createSpace(req.body);
      res.status(201).json({ status: 'success', data: space });
    } catch (e) { next(e); }
  }

  public getAllSpaces = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const spaces = await this.service.getAllSpaces();
      res.status(200).json({ status: 'success', data: spaces });
    } catch (e) { next(e); }
  }

  public bookSeat = async (req: AuthReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new Error('Unauthenticated');
      const { spaceId, startTime, endTime } = req.body;
      const booking = await this.service.bookSeat(req.user.id, spaceId, startTime, endTime);
      res.status(201).json({ status: 'success', data: booking });
    } catch (e) { next(e); }
  }

  public getMyBookings = async (req: AuthReq, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new Error('Unauthenticated');
      const bookings = await this.service.getMyBookings(req.user.id);
      res.status(200).json({ status: 'success', data: bookings });
    } catch (e) { next(e); }
  }
}

export default new SpaceController();
