import ActivityLog, { IActivityLog } from '../models/ActivityLog';
import { IBaseRepository } from './IBaseRepository';
import { FilterQuery, UpdateQuery } from 'mongoose';

export class LogRepository implements IBaseRepository<IActivityLog> {
  async findById(id: string): Promise<IActivityLog | null> {
    return await ActivityLog.findById(id);
  }

  async findOne(filter: FilterQuery<IActivityLog>): Promise<IActivityLog | null> {
    return await ActivityLog.findOne(filter);
  }

  async find(filter: FilterQuery<IActivityLog> = {}): Promise<IActivityLog[]> {
    return await ActivityLog.find(filter);
  }

  async create(data: Partial<IActivityLog>): Promise<IActivityLog> {
    return await ActivityLog.create(data);
  }

  async update(id: string, updateData: UpdateQuery<IActivityLog>): Promise<IActivityLog | null> {
    return await ActivityLog.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await ActivityLog.findByIdAndDelete(id);
    return !!result;
  }

  // Domain Specifics
  async createLog(action: string, details: string, userId: string | null = null, targetId: string | null = null): Promise<void> {
    try {
      await ActivityLog.create({ action, details, user: userId, targetId });
    } catch (e: any) {
      console.warn("Audit Log Engine Failed:", e.message);
    }
  }

  async getRecentLogs(limit: number = 100): Promise<IActivityLog[]> {
    return await ActivityLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

export default new LogRepository();
