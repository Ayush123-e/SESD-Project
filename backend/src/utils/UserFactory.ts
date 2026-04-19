import { IUser } from '../models/User';

export interface IUserFactory {
  createLibrarian(data: Partial<IUser>): Partial<IUser>;
  createMember(data: Partial<IUser>): Partial<IUser>;
}

export class UserFactory implements IUserFactory {
  createLibrarian(data: Partial<IUser>): Partial<IUser> {
    return { ...data, role: 'LIBRARIAN' };
  }

  createMember(data: Partial<IUser>): Partial<IUser> {
    return { ...data, role: 'MEMBER' };
  }
}

export default new UserFactory();
