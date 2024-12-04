import mongoose from 'mongoose';
import User from '../models/User';
import connectToMongoDB from './mongodb';

// Define the structure of a user from the splash page database
interface SplashPageUser {
  email: string;
  userId: string;
  position: number;
  isApproved: boolean;
  hasProAccess: boolean;
}

export const syncUserToMainDB = async (email: string) => {
  try {
    // Step 1: Connect to splash page database (newWingman)
    await connectToMongoDB('newWingman');
    
    // Create a temporary model for the splash page users
    const SplashUser = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
      email: String,
      userId: String,
      position: Number,
      isApproved: Boolean,
      hasProAccess: Boolean
    }));

    // Step 2: Find the user in splash page database
    const splashUser = await SplashUser.findOne({ email });
    
    // Step 3: Verify user exists and is approved
    if (!splashUser || !splashUser.isApproved) {
      throw new Error('User not found or not approved');
    }

    // Step 4: Switch connection to main app database (vgWingman)
    await connectToMongoDB('vgWingman');
    
    // Step 5: Check if user already exists in main database
    const existingUser = await User.findOne({ email });
    
    if (!existingUser) {
      // Step 6: Create new user in main database with all required fields
      const newUser = new User({
        email: splashUser.email,
        userId: splashUser.userId,
        position: null, // Approved users don't need position
        isApproved: true,
        hasProAccess: splashUser.hasProAccess,
        conversationCount: 0,
        achievements: [],
        progress: {
          firstQuestion: 0,
          frequentAsker: 0,
          rpgEnthusiast: 0,
          bossBuster: 0,
          strategySpecialist: 0,
          actionAficionado: 0,
          battleRoyale: 0,
          sportsChampion: 0,
          adventureAddict: 0,
          shooterSpecialist: 0,
          puzzlePro: 0,
          racingExpert: 0,
          stealthSpecialist: 0,
          horrorHero: 0,
          triviaMaster: 0,
          totalQuestions: 0,
          dailyExplorer: 0,
          speedrunner: 0,
          collectorPro: 0,
          dataDiver: 0,
          performanceTweaker: 0,
          conversationalist: 0
        }
      });

      await newUser.save();
      return newUser;
    }

    // Step 7: Return existing user if already in database
    return existingUser;
  } catch (error) {
    console.error('Error syncing user to main DB:', error);
    throw error;
  }
}; 