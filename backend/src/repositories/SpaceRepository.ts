import StudySpace, { IStudySpace } from '../models/StudySpace';
import SeatBooking, { ISeatBooking } from '../models/SeatBooking';
import { IBaseRepository } from './IBaseRepository';
import { FilterQuery, UpdateQuery } from 'mongoose';

export class SpaceRepository implements IBaseRepository<IStudySpace> {
  async findById(id: string): Promise<IStudySpace | null> {
    return await StudySpace.findById(id);
  }

  async findOne(filter: FilterQuery<IStudySpace>): Promise<IStudySpace | null> {
    return await StudySpace.findOne(filter);
  }

  async find(filter: FilterQuery<IStudySpace> = {}): Promise<IStudySpace[]> {
    return await StudySpace.find(filter);
  }

  async create(data: Partial<IStudySpace>): Promise<IStudySpace> {
    return await StudySpace.create(data);
  }

  async update(id: string, updateData: UpdateQuery<IStudySpace>): Promise<IStudySpace | null> {
    return await StudySpace.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await StudySpace.findByIdAndDelete(id);
    return !!result;
  }

  // Domain Specifics
  async createSpace(data: Partial<IStudySpace>): Promise<IStudySpace> {
    return this.create(data);
  }

  async findAllSpaces(query: FilterQuery<IStudySpace> = {}): Promise<IStudySpace[]> {
    return this.find(query);
  }

  async findSpaceById(id: string): Promise<IStudySpace | null> {
    return this.findById(id);
  }

  async getActiveBookingsForSpace(spaceId: string | null, startTime: Date, endTime: Date): Promise<number> {
    const q: FilterQuery<ISeatBooking> = { 
      status: 'active', 
      $or: [ { startTime: { $lt: endTime }, endTime: { $gt: startTime } } ] 
    };
    if (spaceId) q.space = spaceId;
    return await SeatBooking.countDocuments(q);
  }

  async createBooking(data: Partial<ISeatBooking>): Promise<ISeatBooking> {
    return await SeatBooking.create(data);
  }

  async findUserActiveBookings(userId: string): Promise<ISeatBooking[]> {
    return await SeatBooking.find({ user: userId, status: 'active' }).populate('space').sort({ startTime: 1 });
  }
}

export default new SpaceRepository();
