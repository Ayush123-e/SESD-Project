import BorrowingRecord, { IBorrowingRecord } from '../models/BorrowingRecord';
import { IBaseRepository } from './IBaseRepository';
import mongoose, { FilterQuery, UpdateQuery } from 'mongoose';

export class BorrowingRepository implements IBaseRepository<IBorrowingRecord> {
  async findById(id: string): Promise<IBorrowingRecord | null> {
    return await BorrowingRecord.findById(id).populate('book').populate('user', '-password');
  }

  async findOne(filter: FilterQuery<IBorrowingRecord>): Promise<IBorrowingRecord | null> {
    return await BorrowingRecord.findOne(filter);
  }

  async find(filter: FilterQuery<IBorrowingRecord> = {}): Promise<IBorrowingRecord[]> {
    return await BorrowingRecord.find(filter);
  }

  async create(data: Partial<IBorrowingRecord>): Promise<IBorrowingRecord> {
    const record = new BorrowingRecord(data);
    return await record.save();
  }

  async update(id: string, updateData: UpdateQuery<IBorrowingRecord>): Promise<IBorrowingRecord | null> {
    return await BorrowingRecord.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await BorrowingRecord.findByIdAndDelete(id);
    return !!result;
  }

  // Domain specifics
  async countActiveBorrowsByUser(userId: string): Promise<number> {
    return await BorrowingRecord.countDocuments({
      user: userId,
      status: { $in: ['borrowed', 'overdue'] }
    });
  }

  async findActiveBorrowByUserAndBook(userId: string, bookId: string): Promise<IBorrowingRecord | null> {
    return await BorrowingRecord.findOne({
      user: userId,
      book: bookId,
      status: { $in: ['borrowed', 'overdue'] }
    });
  }

  async findAllByUser(userId: string): Promise<IBorrowingRecord[]> {
    return await BorrowingRecord.find({ user: userId })
      .populate('book')
      .sort({ borrowDate: -1 });
  }

  async getMostBorrowedCategory(userId: string): Promise<string | null> {
    const agg = await BorrowingRecord.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $lookup: { from: 'books', localField: 'book', foreignField: '_id', as: 'bookDetails' } },
      { $unwind: '$bookDetails' },
      { $group: { _id: '$bookDetails.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    return agg.length ? agg[0]._id : null;
  }

  async findAll(): Promise<IBorrowingRecord[]> {
    return await BorrowingRecord.find()
      .populate('book')
      .populate('user', '-password')
      .sort({ borrowDate: -1 });
  }

  async findUnpaidFinesByUser(userId: string): Promise<IBorrowingRecord[]> {
    return await BorrowingRecord.find({
      user: userId,
      $or: [
        { fineAmount: { $gt: 0 }, finePaid: false },
        { status: 'borrowed', dueDate: { $lt: new Date() } }
      ]
    }).populate('book').sort({ borrowDate: -1 });
  }

  async findAllUnpaidFines(): Promise<IBorrowingRecord[]> {
    return await BorrowingRecord.find({
      $or: [
        { fineAmount: { $gt: 0 }, finePaid: false },
        { status: 'borrowed', dueDate: { $lt: new Date() } }
      ]
    })
      .populate('book')
      .populate('user', '-password')
      .sort({ borrowDate: -1 });
  }

  async countAllActiveBorrows(): Promise<number> {
    return await BorrowingRecord.countDocuments({ status: 'borrowed' });
  }

  async countAllOverdue(): Promise<number> {
    return await BorrowingRecord.countDocuments({
      status: 'borrowed',
      dueDate: { $lt: new Date() }
    });
  }

  async findActiveBorrowsByUser(userId: string): Promise<IBorrowingRecord[]> {
    return await BorrowingRecord.find({
      user: userId,
      status: 'borrowed'
    }).populate('book').sort({ dueDate: 1 });
  }
}

export default new BorrowingRepository();
