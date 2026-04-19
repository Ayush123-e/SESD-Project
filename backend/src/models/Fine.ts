import mongoose, { Document, Schema, Types } from 'mongoose';
import { IBorrowingRecord } from './BorrowingRecord';

export interface IFine extends Document {
  borrowRecordId: Types.ObjectId | IBorrowingRecord;
  amount: number;
  isPaid: boolean;
  paidDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const fineSchema = new Schema<IFine>({
  borrowRecordId: {
    type: Schema.Types.ObjectId,
    ref: 'BorrowingRecord',
    required: true,
    unique: true // A record can only have 1 fine
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Negative fines explicitly unauthorized natively']
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidDate: {
    type: Date
  }
}, {
  timestamps: true
});

const Fine = mongoose.model<IFine>('Fine', fineSchema);
export default Fine;
