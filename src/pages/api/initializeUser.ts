import type { NextApiRequest, NextApiResponse } from 'next';
import { syncUserToMainDB } from '../../../utils/databaseSync';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Step 1: Verify request method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Step 2: Get email from request body
    const { email } = req.body;
    
    // Step 3: Validate email exists
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Step 4: Attempt to sync user
    const user = await syncUserToMainDB(email);
    
    // Step 5: Return appropriate response
    if (user) {
      res.status(200).json({ success: true, user });
    } else {
      res.status(404).json({ success: false, error: 'User not found or not approved' });
    }
  } catch (error) {
    console.error('Error initializing user:', error);
    res.status(500).json({ success: false, error: 'Failed to initialize user' });
  }
} 