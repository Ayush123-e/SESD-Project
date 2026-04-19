import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import dbInstance from './config/db';
import cron from 'node-cron';
import Book from './models/Book';
import User from './models/User';
import StudySpace from './models/StudySpace';
import BorrowingRecord from './models/BorrowingRecord';
import Fine from './models/Fine';
import WaitlistRecord from './models/WaitlistRecord';
import SeatBooking from './models/SeatBooking';
import { INITIAL_BOOKS, INITIAL_STUDY_SPACES } from './constants/initialData';
import bcrypt from 'bcryptjs';

const PORT = process.env.PORT || 5002;

// Connect to Database
dbInstance.connect().then(async () => {
  // AUTO-SEED: Enhanced Catalog & Member Experience Hydration
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('--- AUTO-SEEDING: Initializing Enterprise Identity & Catalog matrix ---');
      
      // 1. Books
      const seededBooks = await Book.insertMany(INITIAL_BOOKS);
      
      // 2. Spaces
      const seededSpaces = await StudySpace.insertMany(INITIAL_STUDY_SPACES);
      
      // 3. User Accounts (Password: password123)
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const admin = await User.create({
        name: 'Library Director',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'LIBRARIAN',
        membershipTier: 'Premium'
      });

      const member = await User.create({
        name: 'Alex Rivera',
        email: 'member@example.com',
        password: hashedPassword,
        role: 'MEMBER',
        membershipTier: 'Premium',
        totalPendingFines: 25.50
      });

      // 4. Active Issues (Demo)
      const borrow1 = await BorrowingRecord.create({
        user: member._id,
        book: seededBooks[0]._id,
        borrowDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
        status: 'BORROWED'
      });

      const borrow2 = await BorrowingRecord.create({
        user: member._id,
        book: seededBooks[1]._id,
        borrowDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),  // Overdue by 2 days
        status: 'OVERDUE'
      });

      // 5. Dues Trace (Demo)
      await Fine.create({
        borrowRecordId: borrow2._id,
        amount: 25.50,
        isPaid: false
      });

      // 6. Locked Slots / Waitlist (Demo)
      await WaitlistRecord.create({
        user: member._id,
        book: seededBooks[4]._id, // 5th book (availableQuantity: 0 in my seed logic?)
        status: 'PENDING'
      });

      // 7. Reservations (Demo)
      await SeatBooking.create({
        user: member._id,
        space: seededSpaces[2]._id, // Strategic Collaborator Suite
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // Starts in 2 hours
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),   // Ends in 4 hours
        status: 'active'
      });

      console.log('--- SUCCESS: Multi-Collections Hydrated Seamlessly ---');
    } else {
      console.log('--- SEED SKIP: Identity Cluster Detected ---');
    }
  } catch (seedErr: any) {
    console.error('--- SEED FAILURE: Demo Payload Crash ---', seedErr.message);
  }

  // Start Server only if DB connects successfully
  const server = app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // CRON ENGINE: Sweep Due dates and Waitlist Expirations automatically natively
  cron.schedule('0 0 * * *', async () => {
      console.log('--- CRON SWEEP STARTING: Library Due Dates & Waitlists ---');
      // Placholder for heavy loop sweeps mapped via Service layers.
      console.log('--- CRON SWEEP FINISHED ---');
  });

  // Handle Unhandled Promise Rejections (e.g. database goes offline)
  process.on('unhandledRejection', (err: any) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err?.name, err?.message);
    server.close(() => {
      process.exit(1);
    });
  });
});

// Handle synchronous errors that weren't caught
process.on('uncaughtException', (err: any) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});
