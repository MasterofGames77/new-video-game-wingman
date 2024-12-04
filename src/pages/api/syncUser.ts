import type { NextApiRequest, NextApiResponse } from 'next';
import { syncUserToMainDB } from '../../../utils/databaseSync';
import connectToMongoDB from '../../../utils/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToMongoDB();
    
    const { email, userId, position, isApproved } = req.body;
    
    // Check if user qualifies for pro access based on position
    const hasProAccess = typeof position === 'number' && position <= 5000;
    
    const userData = {
      email,
      userId,
      position,
      isApproved,
      hasProAccess
    };

    const syncedUser = await syncUserToMainDB(email);
    
    res.status(200).json({ success: true, user: syncedUser });
  } catch (error) {
    console.error('Error in syncUser API:', error);
    res.status(500).json({ success: false, error: 'Failed to sync user data' });
  }
} 