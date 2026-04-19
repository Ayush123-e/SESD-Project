import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './User';
import { IBook } from './Book';

export interface IWaitlistRecord extends Document {
  user: Types.ObjectId | IUser;
  book: Types.ObjectId | IBook;
  status: 'pending' | 'notified' | 'fulfilled' | 'expired';
  notifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const waitlistRecordSchema = new Schema<IWaitlistRecord>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'notified', 'fulfilled', 'expired'],
    default: 'pending'
  },
  notifiedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const WaitlistRecord = mongoose.model<IWaitlistRecord>('WaitlistRecord', waitlistRecordSchema);
export default WaitlistRecord;
