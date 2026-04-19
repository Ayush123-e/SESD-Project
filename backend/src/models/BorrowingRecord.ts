import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './User';
import { IBook } from './Book';

export interface IBorrowingRecord extends Document {
  user: Types.ObjectId | IUser;
  book: Types.ObjectId | IBook;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
}

const borrowingRecordSchema = new Schema<IBorrowingRecord>({
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
  borrowDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['BORROWED', 'RETURNED', 'OVERDUE'],
    default: 'BORROWED'
  }
}, {
  timestamps: true
});

const BorrowingRecord = mongoose.model<IBorrowingRecord>('BorrowingRecord', borrowingRecordSchema);
export default BorrowingRecord;
