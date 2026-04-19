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
    const bookCount = await Book.countDocuments();

    // 1. FULL INITIAL SEED (If database is completely empty)
    if (userCount === 0 || bookCount === 0) {
      console.log('--- AUTO-SEEDING: Hydrating blank catalog and identity matrix ---');
      
      const seededBooks = await Book.insertMany(INITIAL_BOOKS);
      const seededSpaces = await StudySpace.insertMany(INITIAL_STUDY_SPACES);
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await User.create({
        name: 'Library Director',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'LIBRARIAN',
        membershipTier: 'Premium'
      });

      await User.create({
        name: 'Alex Rivera',
        email: 'member@example.com',
        password: hashedPassword,
        role: 'MEMBER',
        membershipTier: 'Premium'
      });
      console.log('--- SUCCESS: Core foundations established ---');
    }

    // 2. ITERATIVE HYDRATION (Ensure all members have demo data for the UX walkthrough)
    const members = await User.find({ role: 'MEMBER' });
    const availableBooks = await Book.find().limit(20);
    const availableSpaces = await StudySpace.find().limit(5);

    console.log(`--- SYNC CHECK: Found ${members.length} members to verify ---`);

    for (const member of members) {
      const hasRecords = await BorrowingRecord.exists({ user: member._id });
      if (!hasRecords && availableBooks.length > 0) {
        console.log(`--- HYDRATING DEMO DATA: ${member.name} (${member.email}) ---`);
        
        // Ensure some books are available for borrowing logic natively
        member.totalPendingFines = 50.75;
        await member.save();

        // Issue 1: Active
        await BorrowingRecord.create({
          user: member._id,
          book: availableBooks[0]._id,
          borrowDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          dueDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
          status: 'BORROWED'
        });

        // Issue 2: Overdue
        const overdueRecord = await BorrowingRecord.create({
          user: member._id,
          book: availableBooks[1]._id,
          borrowDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          status: 'OVERDUE'
        });

        // Dues Trace
        await Fine.create({
          borrowRecordId: overdueRecord._id,
          amount: 50.75,
          isPaid: false
        });

        // Locked Slots
        if (availableBooks.length > 5) {
          await WaitlistRecord.create({
            user: member._id,
            book: availableBooks[5]._id,
            status: 'PENDING'
          });
        }

        // Reservations
        if (availableSpaces.length > 0) {
          await SeatBooking.create({
            user: member._id,
            space: availableSpaces[0]._id,
            startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
            endTime: new Date(Date.now() + 4 * 60 * 60 * 1000)
          });
        }
      }
    }
    console.log('--- SYSTEM: All identity and catalog clusters synchronized ---');
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
