import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './User';

export interface IActivityLog extends Document {
  action: 'REGISTER' | 'LOGIN' | 'BORROW' | 'RETURN' | 'WAITLIST_JOIN' | 'WAITLIST_NOTIFY' | 'WAITLIST_EXPIRED' | 'FINE_CLEARED' | 'BOOK_ADDED' | 'BOOK_UPDATED' | 'BOOK_DELETED';
  user?: Types.ObjectId | IUser;
  targetId?: Types.ObjectId;
  details: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const activityLogSchema = new Schema<IActivityLog>({
  action: {
    type: String,
    required: true,
    enum: ['REGISTER', 'LOGIN', 'BORROW', 'RETURN', 'WAITLIST_JOIN', 'WAITLIST_NOTIFY', 'WAITLIST_EXPIRED', 'FINE_CLEARED', 'BOOK_ADDED', 'BOOK_UPDATED', 'BOOK_DELETED']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  targetId: {
    type: Schema.Types.ObjectId
  },
  details: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
export default ActivityLog;
