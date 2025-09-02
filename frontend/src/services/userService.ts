const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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