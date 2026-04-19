import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  ISBN: string;
  category: 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'TECHNOLOGY' | 'BIOGRAPHY';
  coverImageUrl: string | null;
  borrowCount: number;
  quantity: number;
  availableQuantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const bookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  ISBN: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'TECHNOLOGY', 'BIOGRAPHY'],
    required: [true, 'Category is required']
  },
  coverImageUrl: {
    type: String,
    default: null
  },
  borrowCount: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    required: [true, 'Total quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  availableQuantity: {
    type: Number,
    required: [true, 'Available quantity is required'],
    min: [0, 'Available quantity cannot be negative']
  }
}, {
  timestamps: true
});

const Book = mongoose.model<IBook>('Book', bookSchema);
export default Book;
