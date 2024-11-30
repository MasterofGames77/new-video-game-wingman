import User from '../models/User';

interface SplashPageUser {
  email: string;
  userId: string;
  position: number;
  isApproved: boolean;
  hasProAccess: boolean;
}

export const syncUserData = async (splashPageUser: SplashPageUser) => {
  try {
    // Check if user already exists in vgWingman database
    const existingUser = await User.findOne({ email: splashPageUser.email });
    
    if (!existingUser) {
      // Create new user in vgWingman database with initial values
      const newUser = new User({
        email: splashPageUser.email,
        userId: splashPageUser.userId,
        position: splashPageUser.isApproved ? null : splashPageUser.position,
        isApproved: splashPageUser.isApproved,
        hasProAccess: splashPageUser.hasProAccess,
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

    // Update existing user if needed
    return await User.findOneAndUpdate(
      { email: splashPageUser.email },
      {
        isApproved: splashPageUser.isApproved,
        hasProAccess: splashPageUser.hasProAccess,
        position: splashPageUser.isApproved ? null : splashPageUser.position
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error syncing user data:', error);
    throw error;
  }
};

export const checkAndAssignProAccess = async (email: string): Promise<boolean> => {
  const signupDeadline = new Date('2024-12-31T23:59:59.999Z');
  const currentDate = new Date();

  return currentDate <= signupDeadline;
}; 