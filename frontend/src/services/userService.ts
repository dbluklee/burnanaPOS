const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

export interface SignUpData {
  businessRegistrationNumber: string;
  storeName: string;
  ownerName: string;
  phoneNumber: string;
  email: string;
  storeAddress: string;
  naverStoreLink?: string;
}

export interface UserProfile {
  id: number;
  storeName: string;
  ownerName: string;
  email: string;
  storeNumber: string;
  userPin?: string;
  storeAddress?: string;
  naverStoreLink?: string;
  createdAt?: Date;
}

export interface SignInData {
  storeNumber: string;
  userPin: string;
}

class UserService {
  async checkServerConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000, // 5 second timeout
      });

      if (response.ok) {
        return { 
          connected: true, 
          message: 'Server connection successful' 
        };
      } else {
        return { 
          connected: false, 
          message: `Server responded with status ${response.status}` 
        };
      }
    } catch (error) {
      return { 
        connected: false, 
        message: `Server connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async register(signUpData: SignUpData): Promise<UserProfile> {
    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signUpData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to register user');
    }

    return await response.json();
  }

  async signIn(signInData: SignInData): Promise<UserProfile> {
    const response = await fetch(`${API_BASE}/users/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signInData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to sign in');
    }

    return await response.json();
  }

  async getUserProfile(storeNumber: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE}/users/${storeNumber}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch user profile');
    }

    return await response.json();
  }
}

export const userService = new UserService();