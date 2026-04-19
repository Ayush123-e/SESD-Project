import mongoose from 'mongoose';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Using existing database connection');
      return;
    }

    try {
      let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/library';
      
      try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
      } catch (err) {
        console.warn('Local MongoDB offline! Spinning up in-memory replica bound seamlessly...');
        // @ts-ignore
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const memUri = mongoServer.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`MongoDB Memory Connected: ${conn.connection.host}`);
      }
      this.isConnected = true;
    } catch (error: any) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      process.exit(1);
    }
  }
}

const dbInstance = DatabaseConnection.getInstance();
export default dbInstance;
