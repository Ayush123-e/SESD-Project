import Fine, { IFine } from '../models/Fine';
import { IBaseRepository } from './IBaseRepository';
import { FilterQuery, UpdateQuery } from 'mongoose';

export class FineRepository implements IBaseRepository<IFine> {
  async findById(id: string): Promise<IFine | null> {
    return await Fine.findById(id).populate('borrowRecordId');
  }

  async findOne(filter: FilterQuery<IFine>): Promise<IFine | null> {
    return await Fine.findOne(filter).populate('borrowRecordId');
  }

  async find(filter: FilterQuery<IFine> = {}): Promise<IFine[]> {
    return await Fine.find(filter).populate('borrowRecordId');
  }

  async create(data: Partial<IFine>): Promise<IFine> {
    const fine = new Fine(data);
    return await fine.save();
  }

  async update(id: string, updateData: UpdateQuery<IFine>): Promise<IFine | null> {
    return await Fine.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Fine.findByIdAndDelete(id);
    return !!result;
  }

  // Domain specifics
  async getByRecordId(borrowRecordId: string): Promise<IFine | null> {
      return await Fine.findOne({ borrowRecordId });
  }

  async findAllUnpaidFines(): Promise<IFine[]> {
      return await Fine.find({ isPaid: false }).populate({
          path: 'borrowRecordId',
          populate: { path: 'user book' }
      });
  }
}

export default new FineRepository();
