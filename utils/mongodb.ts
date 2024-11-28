import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const MAX_RETRIES = 5;
let retries = 0;

const connectToMongoDB = async (database: 'vgWingman' | 'newWingman' = 'vgWingman'): Promise<void> => {
  const uri = database === 'vgWingman' 
    ? process.env.MONGODB_URI 
    : process.env.MONGODB_URI_SPLASH;

  if (mongoose.connection.readyState === 0) {
    while (retries < MAX_RETRIES) {
      try {
        console.log(`[${new Date().toISOString()}] Attempting to connect to MongoDB ${database}...`);
        await mongoose.connect(uri as string);
        console.log(`Connected to MongoDB ${database}`);
        break;
      } catch (error) {
        retries += 1;
        console.error(`MongoDB connection error: ${error}. Retry ${retries}/${MAX_RETRIES}`);
        if (retries >= MAX_RETRIES) {
          throw new Error('Max retries reached. MongoDB connection failed.');
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  } else {
    console.log(`Already connected to MongoDB ${database}`);
  }
};

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error after initial connect: ${err}`);
});

export default connectToMongoDB;