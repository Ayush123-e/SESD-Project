import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './User';
import { IStudySpace } from './StudySpace';

export interface ISeatBooking extends Document {
  user: Types.ObjectId | IUser;
  space: Types.ObjectId | IStudySpace;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

const seatBookingSchema = new Schema<ISeatBooking>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  space: {
    type: Schema.Types.ObjectId,
    ref: 'StudySpace',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, { timestamps: true });

const SeatBooking = mongoose.model<ISeatBooking>('SeatBooking', seatBookingSchema);
export default SeatBooking;
