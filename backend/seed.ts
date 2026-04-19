import mongoose from 'mongoose';
import Book from './src/models/Book';
import dotenv from 'dotenv';
dotenv.config();

const books = [
  // FICTION
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', ISBN: '9780743273565', category: 'FICTION', quantity: 5, availableQuantity: 5, borrowCount: 120 },
  { title: '1984', author: 'George Orwell', ISBN: '9780451524935', category: 'FICTION', quantity: 7, availableQuantity: 5, borrowCount: 180 },
  { title: 'Brave New World', author: 'Aldous Huxley', ISBN: '9780060850524', category: 'FICTION', quantity: 4, availableQuantity: 4, borrowCount: 90 },

  // NON_FICTION
  { title: 'Atomic Habits', author: 'James Clear', ISBN: '9780735211292', category: 'NON_FICTION', quantity: 15, availableQuantity: 15, borrowCount: 410 },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', ISBN: '9780374533557', category: 'NON_FICTION', quantity: 3, availableQuantity: 1, borrowCount: 45 },
  { title: 'Deep Work', author: 'Cal Newport', ISBN: '9781455586691', category: 'NON_FICTION', quantity: 8, availableQuantity: 8, borrowCount: 150 },

  // SCIENCE
  { title: 'A Brief History of Time', author: 'Stephen Hawking', ISBN: '9780553380163', category: 'SCIENCE', quantity: 6, availableQuantity: 6, borrowCount: 220 },
  { title: 'Cosmos', author: 'Carl Sagan', ISBN: '9780345331359', category: 'SCIENCE', quantity: 5, availableQuantity: 5, borrowCount: 300 },
  { title: 'The Selfish Gene', author: 'Richard Dawkins', ISBN: '9780198788607', category: 'SCIENCE', quantity: 4, availableQuantity: 2, borrowCount: 85 },

  // HISTORY
  { title: 'Sapiens', author: 'Yuval Noah Harari', ISBN: '9780062316097', category: 'HISTORY', quantity: 8, availableQuantity: 3, borrowCount: 95 },
  { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', ISBN: '9780393317558', category: 'HISTORY', quantity: 5, availableQuantity: 5, borrowCount: 75 },
  { title: 'The Silk Roads', author: 'Peter Frankopan', ISBN: '9781101912379', category: 'HISTORY', quantity: 3, availableQuantity: 3, borrowCount: 40 },

  // TECHNOLOGY
  { title: 'Clean Code', author: 'Robert C. Martin', ISBN: '9780132350884', category: 'TECHNOLOGY', quantity: 10, availableQuantity: 10, borrowCount: 300 },
  { title: 'The Pragmatic Programmer', author: 'Dave Thomas', ISBN: '9780135957059', category: 'TECHNOLOGY', quantity: 4, availableQuantity: 0, borrowCount: 65 },
  { title: 'Design Patterns', author: 'Erich Gamma', ISBN: '9780201633610', category: 'TECHNOLOGY', quantity: 5, availableQuantity: 5, borrowCount: 110 },

  // BIOGRAPHY
  { title: 'Steve Jobs', author: 'Walter Isaacson', ISBN: '9781451648539', category: 'BIOGRAPHY', quantity: 12, availableQuantity: 10, borrowCount: 280 },
  { title: 'The Diary of a Young Girl', author: 'Anne Frank', ISBN: '9780553296983', category: 'BIOGRAPHY', quantity: 10, availableQuantity: 10, borrowCount: 500 },
  { title: 'Elon Musk', author: 'Ashlee Vance', ISBN: '9780062301239', category: 'BIOGRAPHY', quantity: 6, availableQuantity: 4, borrowCount: 190 }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library_system_db';
    await mongoose.connect(mongoUri);
    console.log(`Connected natively to MongoDB mapping at ${mongoUri}.`);
    
    await Book.deleteMany({});
    console.log('Cleared existing mapped catalog.');
    
    await Book.insertMany(books);
    console.log(`Seeded Library successfully with ${books.length} structural books.`);
    
    process.exit(0);
  } catch (err) {
    console.error('Seed crash locally:', err);
    process.exit(1);
  }
}
seed();
