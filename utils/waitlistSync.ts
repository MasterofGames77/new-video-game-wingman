import mongoose from 'mongoose';
import axios from 'axios';

// Interface for Splash Page User
interface SplashUser {
  email: string;
  userId: string;
  position: number;
  isApproved: boolean;
  hasProAccess?: boolean;
}

// MongoDB connection for the splash page
const connectToSplashDB = async (): Promise<mongoose.Connection> => {
    try {
      if (!mongoose.connections.some(conn => conn.readyState === 1)) {
        await mongoose.connect(process.env.MONGODB_URI_SPLASH!);
        console.log('Connected to Splash Page DB (via video-game-wingman)');
      }
      return mongoose.connection;
    } catch (error) {
      console.error('Error connecting to Splash Page DB:', error);
      throw error;
    }
};

// Fetch approved users directly from Splash Page DB
const fetchApprovedUsersFromDB = async (): Promise<SplashUser[]> => {
  try {
    const splashDB = await connectToSplashDB();
    const SplashUserModel = splashDB.model<SplashUser & mongoose.Document>('User', new mongoose.Schema({
      email: String,
      position: Number,
      isApproved: Boolean,
      hasProAccess: Boolean,
    }));

    return await SplashUserModel.find({ isApproved: true }).lean();
  } catch (error) {
    console.error('Error fetching approved users from DB:', error);
    throw error;
  }
};

// Sync approved users to Wingman DB via API
const syncApprovedUsers = async (approvedUsers: SplashUser[]) => {
  try {
    for (const user of approvedUsers) {
      const response = await axios.post(`${process.env.WINGMAN_API_URL}/api/syncUser`, user);
      console.log(`User synced: ${response.data.user.email}`);
    }
    console.log('All users synced successfully.');
  } catch (error) {
    console.error('Error syncing approved users:', error);
    throw error;
  }
};

// Main function for synchronizing the waitlist
export const syncWaitlist = async () => {
  try {
    console.log('Fetching approved users from Splash Page DB...');
    const approvedUsers = await fetchApprovedUsersFromDB();

    if (approvedUsers.length === 0) {
      console.log('No users to sync.');
      return;
    }

    console.log(`Found ${approvedUsers.length} approved users. Syncing to Wingman DB...`);
    await syncApprovedUsers(approvedUsers);
  } catch (error) {
    console.error('Error in waitlist sync process:', error);
  }
};