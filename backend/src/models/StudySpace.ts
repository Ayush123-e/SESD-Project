import mongoose, { Document, Schema } from 'mongoose';

export interface IStudySpace extends Document {
  name: string;
  capacity: number;
  amenities: string[];
  status: 'active' | 'maintenance';
  createdAt?: Date;
  updatedAt?: Date;
}

const studySpaceSchema = new Schema<IStudySpace>({
  name: {
    type: String,
    required: [true, 'Space name bounds natively strictly required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Structural limit capacities are mandatory']
  },
  amenities: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'maintenance'],
    default: 'active'
  }
}, { timestamps: true });

const StudySpace = mongoose.model<IStudySpace>('StudySpace', studySpaceSchema);
export default StudySpace;
