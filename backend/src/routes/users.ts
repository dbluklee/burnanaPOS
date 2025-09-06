import express from 'express';
import { User } from '../models/User';
import { Log } from '../models/Log';

// Updated to use new column names: store_name, owner_name, phone_number

const router = express.Router();

// Register new user/store
router.post('/register', async (req, res) => {
  try {
    const {
      businessRegistrationNumber,
      storeName,
      ownerName,
      phoneNumber,
      email,
      storeAddress,
      naverStoreLink,
      preWork
    } = req.body;

    // Validation
    if (!businessRegistrationNumber || !storeName || !ownerName || !phoneNumber || !email || !storeAddress) {
      return res.status(400).json({ 
        error: 'Missing required fields: businessRegistrationNumber, storeName, ownerName, phoneNumber, email, storeAddress' 
      });
    }

    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const newUser = await User.create({
      business_registration_number: businessRegistrationNumber,
      store_name: storeName,
      owner_name: ownerName,
      phone_number: phoneNumber,
      email,
      store_address: storeAddress,
      naver_store_link: naverStoreLink,
      pre_work: preWork
    });

    // Log the registration
    await Log.create({
      type: 'USER_REGISTERED',
      message: `New user registered: ${storeName}`,
      user_pin: newUser.user_pin,
      store_number: newUser.store_number,
      metadata: JSON.stringify({ email, owner_name: ownerName })
    });

    // Return user data without sensitive info
    const responseData = {
      id: newUser.id,
      storeName: newUser.store_name,
      ownerName: newUser.owner_name,
      email: newUser.email,
      storeNumber: newUser.store_number,
      userPin: newUser.user_pin,
      preWork: newUser.pre_work,
      createdAt: newUser.created_at
    };

    res.status(201).json(responseData);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Sign in / authenticate user
router.post('/signin', async (req, res) => {
  try {
    const { storeNumber, userPin } = req.body;

    if (!storeNumber || !userPin) {
      return res.status(400).json({ error: 'Store number and user PIN are required' });
    }

    const user = await User.authenticate(storeNumber, userPin);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Log the sign in
    await Log.create({
      type: 'USER_SIGNIN',
      message: `User signed in: ${user.store_name}`,
      user_pin: user.user_pin,
      store_number: user.store_number
    });

    // Return user data without sensitive info
    const responseData = {
      id: user.id,
      storeName: user.store_name,
      ownerName: user.owner_name,
      email: user.email,
      storeNumber: user.store_number,
      userPin: user.user_pin,
      preWork: user.pre_work
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error signing in user:', error);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

// Get user profile by store number
router.get('/:storeNumber', async (req, res) => {
  try {
    const { storeNumber } = req.params;
    const user = await User.findByStoreNumber(storeNumber);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user data without sensitive info
    const responseData = {
      id: user.id,
      storeName: user.store_name,
      ownerName: user.owner_name,
      email: user.email,
      storeNumber: user.store_number,
      storeAddress: user.store_address,
      naverStoreLink: user.naver_store_link,
      preWork: user.pre_work
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;