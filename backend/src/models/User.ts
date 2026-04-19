import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'LIBRARIAN' | 'MEMBER';
  membershipTier: 'Free' | 'Standard' | 'Premium';
  membershipValidUntil: Date | null;
  totalPendingFines: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false // Always hide password by default in queries
  },
  role: {
    type: String,
    enum: ['LIBRARIAN', 'MEMBER'],
    default: 'MEMBER'
  },
  membershipTier: {
    type: String,
    enum: ['Free', 'Standard', 'Premium'],
    default: 'Standard'
  },
  membershipValidUntil: {
    type: Date,
    default: null
  },
  totalPendingFines: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Automatically manages createdAt and updatedAt
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
