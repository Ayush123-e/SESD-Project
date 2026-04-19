import WaitlistRecord, { IWaitlistRecord } from '../models/WaitlistRecord';
import { IBaseRepository } from './IBaseRepository';
import { FilterQuery, UpdateQuery } from 'mongoose';

export class WaitlistRepository implements IBaseRepository<IWaitlistRecord> {
  async findById(id: string): Promise<IWaitlistRecord | null> {
    return await WaitlistRecord.findById(id);
  }

  async findOne(filter: FilterQuery<IWaitlistRecord>): Promise<IWaitlistRecord | null> {
    return await WaitlistRecord.findOne(filter);
  }

  async find(filter: FilterQuery<IWaitlistRecord> = {}): Promise<IWaitlistRecord[]> {
    return await WaitlistRecord.find(filter);
  }

  async create(data: Partial<IWaitlistRecord>): Promise<IWaitlistRecord> {
    const record = new WaitlistRecord(data);
    return await record.save();
  }

  async update(id: string, updateData: UpdateQuery<IWaitlistRecord>): Promise<IWaitlistRecord | null> {
    return await WaitlistRecord.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await WaitlistRecord.findByIdAndDelete(id);
    return !!result;
  }

  // Domain specifics
  async addToWaitlist(userId: string, bookId: string): Promise<IWaitlistRecord> {
    return await WaitlistRecord.create({ user: userId, book: bookId });
  }

  async getFirstPending(bookId: string): Promise<IWaitlistRecord | null> {
    return await WaitlistRecord.findOne({ book: bookId, status: 'pending' })
      .sort({ createdAt: 1 })
      .populate('user');
  }

  async getUserActiveWaitlist(userId: string): Promise<IWaitlistRecord[]> {
    return await WaitlistRecord.find({ user: userId, status: { $in: ['pending', 'notified'] } })
      .populate('book');
  }

  async updateStatus(id: string, status: 'pending' | 'notified' | 'fulfilled' | 'expired', notifiedAt: Date | null = null): Promise<IWaitlistRecord | null> {
    const update: UpdateQuery<IWaitlistRecord> = { status };
    if (notifiedAt) update.notifiedAt = notifiedAt;
    return await WaitlistRecord.findByIdAndUpdate(id, update, { new: true });
  }
  
  async findExpiredNotified(): Promise<IWaitlistRecord[]> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return await WaitlistRecord.find({
      status: 'notified',
      notifiedAt: { $lt: twentyFourHoursAgo }
    }).populate('book');
  }
}

export default new WaitlistRepository();
