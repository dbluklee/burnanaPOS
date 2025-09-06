import { pool } from './database';

export interface UserRecord {
  id?: number;
  business_registration_number: string;
  store_name: string;
  owner_name: string;
  phone_number: string;
  email: string;
  store_address: string;
  naver_store_link?: string;
  store_number: string;
  user_pin: string;
  pre_work?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export class User {
  static generateStoreNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return timestamp + random;
  }

  static generateUserPin(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  static async create(userData: Omit<UserRecord, 'id' | 'created_at' | 'updated_at' | 'store_number' | 'user_pin'>): Promise<UserRecord> {
    const client = await pool.connect();
    try {
      const storeNumber = this.generateStoreNumber();
      const userPin = this.generateUserPin();

      const result = await client.query(
        `INSERT INTO users (business_registration_number, store_name, owner_name, phone_number, email, store_address, naver_store_link, store_number, user_pin, pre_work)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          userData.business_registration_number,
          userData.store_name,
          userData.owner_name,
          userData.phone_number,
          userData.email,
          userData.store_address,
          userData.naver_store_link || null,
          storeNumber,
          userPin,
          userData.pre_work || false
        ]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByEmail(email: string): Promise<UserRecord | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async findByStoreNumber(storeNumber: string): Promise<UserRecord | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE store_number = $1', [storeNumber]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async findById(id: number): Promise<UserRecord | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async authenticate(storeNumber: string, userPin: string): Promise<UserRecord | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE store_number = $1 AND user_pin = $2', [storeNumber, userPin]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}