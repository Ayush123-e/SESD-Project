import nodemailer from 'nodemailer';
import { IUser } from '../models/User';
import { IBook } from '../models/Book';

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initEthereal(); // Safely bounds natively inside instance block
  }

  private async initEthereal(): Promise<void> {
    try {
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports.
        auth: {
          user: testAccount.user, // generated ethereal mock user bounds
          pass: testAccount.pass  // generated ethereal bounds
        }
      });
      console.log('Ethereal Email Engine mounted securely! Catching explicit payload logs...');
    } catch (err: any) {
      console.error('Failed to init Ethereal transports map natively:', err.message);
    }
  }

  private async sendMail(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) {
      console.warn('Transporter absent! Wait mapping payload temporarily skipped.');
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: '"Online Library System" <noreply@librarysys.local>',
        to,
        subject,
        html
      });
      
      console.log(`[EMAIL DISPATCHED] Message trace: ${info.messageId}`);
      console.log(`[PREVIEW URL] ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error: any) {
      console.error('Email Dispatch Crash trace logic error:', error.message);
    }
  }

  // Pre-configured payload mapping wrappers natively
  public async sendWelcomeEmail(user: IUser): Promise<void> {
    const html = `
      <h2>Welcome to the local network Library System, ${user.name}!</h2>
      <p>Your member account is officially registered seamlessly.</p>
      <p>Login securely to trace available stocks mapping visually.</p>
    `;
    this.sendMail(user.email, 'Welcome to LibrarySys!', html);
  }

  public async sendBorrowConfirmation(user: IUser, book: IBook, dueDate: Date): Promise<void> {
    const html = `
      <h2>Checkout Confirmed Successfully!</h2>
      <p>Hi ${user.name}, you have checked out <strong>${book.title}</strong> flawlessly.</p>
      <p>Your explicit bound due-date is: <strong>${new Date(dueDate).toDateString()}</strong>.</p>
    `;
    this.sendMail(user.email, 'Book Checkout Confirmation Details', html);
  }

  public async sendWaitlistNotification(user: IUser, book: IBook): Promise<void> {
    const html = `
      <h2>Your Waitlist Queue Item is Available!</h2>
      <p>Hi ${user.name}, the exact stock record <strong>${book.title}</strong> has just been returned natively to the catalog matrix!</p>
      <p>You have explicitly <strong>24 hours</strong> to claim your check-out visually before the bounds natively expire pushing limits to the next member.</p>
    `;
    this.sendMail(user.email, 'Waitlist Item Available Action Required!', html);
  }
}

export default new EmailService();
