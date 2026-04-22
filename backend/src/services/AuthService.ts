import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';
import { UserFactory } from '../utils/UserFactory';
import { UserRepository } from '../repositories/UserRepository';
import { EmailService } from './EmailService';
import { LogRepository } from '../repositories/LogRepository';
import { RegisterDTO, LoginDTO, AuthResponseDTO } from '../dtos/AuthDTO';
import { IUser } from '../models/User';

export class AuthService {
  constructor(
    private userRepository: UserRepository = new UserRepository(),
    private userFactory: UserFactory = new UserFactory(),
    private emailService: EmailService = new EmailService(),
    private logRepository: LogRepository = new LogRepository()
  ) {}

  public async register(payload: RegisterDTO): Promise<AuthResponseDTO> {
    const { name, email, password, role } = payload;
    
    // 1. Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email is already in use.', 400);
    }

    if (!password) {
      throw new AppError('Password required natively', 400);
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Construct user object seamlessly using Factory pattern
    let userData: Partial<IUser> = { name, email, password: hashedPassword };
    if (role === 'LIBRARIAN') {
      userData = this.userFactory.createLibrarian(userData);
    } else {
      userData = this.userFactory.createMember(userData);
    }

    // 4. Save via Repository
    const user = await this.userRepository.create(userData);

    // Async payload interceptors triggered securely tracking logs
    this.emailService.sendWelcomeEmail(user);
    this.logRepository.createLog('REGISTER', 'Mapped new local User profile creation successfully.', user._id as any);

    // 5) Generate secure JWT
    const token = this.generateToken(user._id, user.role);

    return { user: this.sanitizeUser(user), token };
  }

  public async login(payload: LoginDTO): Promise<AuthResponseDTO> {
    const { email, password } = payload;
    
    // 1. Find user using specialized auth repository method
    const user = await this.userRepository.findByEmailForAuth(email);
    if (!user || !user.password) {
      throw new AppError('Incorrect email or password', 401);
    }

    if (!password) {
      throw new AppError('Password natively required', 400);
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Incorrect email or password', 401);
    }

    // 3. Generate token
    const token = this.generateToken(user._id, user.role);
    this.logRepository.createLog('LOGIN', 'User accessed visual explicit session correctly.', user._id as any);

    return { 
      user: this.sanitizeUser(user), 
      token 
    };
  }

  private generateToken(id: any, role: string): string {
    return jwt.sign(
      { id, role }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
    );
  }

  private sanitizeUser(user: IUser): AuthResponseDTO['user'] {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }
}

export default new AuthService();
