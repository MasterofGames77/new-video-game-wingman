const initializeUser = async (email: string) => {
  try {
    // Step 1: Make POST request to initialization endpoint
    const response = await fetch('/api/initializeUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    // Step 2: Check if request was successful
    if (!response.ok) {
      throw new Error('Failed to initialize user');
    }

    // Step 3: Parse and return user data
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error initializing user:', error);
    throw error;
  }
}; 