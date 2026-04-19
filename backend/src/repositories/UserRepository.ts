import User, { IUser } from '../models/User';
import { IBaseRepository } from './IBaseRepository';

export class UserRepository implements IBaseRepository<IUser> {
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async findOne(filter: import('mongoose').FilterQuery<IUser>): Promise<IUser | null> {
    return await User.findOne(filter);
  }

  async find(filter: import('mongoose').FilterQuery<IUser> = {}): Promise<IUser[]> {
    return await User.find(filter);
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async update(id: string, updateData: import('mongoose').UpdateQuery<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }

  // Domain specific methods extending base bounds
  async findByEmailForAuth(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('+password');
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async countMembers(): Promise<number> {
    return await User.countDocuments({ role: 'Member' });
  }
}

export default new UserRepository();
