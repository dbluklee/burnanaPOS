import { pool, UserRecord, StoreRecord } from './database';

export class User {
  // User management methods
  static async create(userData: Omit<UserRecord, 'id' | 'created_at' | 'updated_at'>): Promise<UserRecord> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO users (phone, name, email)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userData.phone, userData.name, userData.email || null]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByPhone(phone: string): Promise<UserRecord | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE phone = $1', [phone]);
      return result.rows[0] || null;
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

  static async findById(id: number): Promise<UserRecord | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}

export class Store {
  static generateStoreNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return timestamp + random;
  }

  static generateUserPin(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  static async create(storeData: Omit<StoreRecord, 'id' | 'created_at' | 'updated_at' | 'store_number' | 'user_pin'>): Promise<StoreRecord> {
    const client = await pool.connect();
    try {
      const storeNumber = this.generateStoreNumber();
      const userPin = this.generateUserPin();

      const result = await client.query(
        `INSERT INTO stores (user_id, business_registration_number, store_name, owner_name, 
         store_address, naver_store_link, store_number, user_pin, pre_work)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          storeData.user_id,
          storeData.business_registration_number,
          storeData.store_name,
          storeData.owner_name,
          storeData.store_address,
          storeData.naver_store_link || null,
          storeNumber,
          userPin,
          storeData.pre_work || false
        ]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByStoreNumber(storeNumber: string): Promise<StoreRecord | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM stores WHERE store_number = $1', [storeNumber]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async findById(id: number): Promise<StoreRecord | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM stores WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async findByUserId(userId: number): Promise<StoreRecord[]> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM stores WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async authenticate(storeNumber: string, userPin: string): Promise<StoreRecord | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM stores WHERE store_number = $1 AND user_pin = $2', [storeNumber, userPin]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Get store with user information
  static async findWithUserInfo(storeId: number): Promise<(StoreRecord & { user_name: string; user_phone: string; user_email?: string }) | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT s.*, u.name as user_name, u.phone as user_phone, u.email as user_email
        FROM stores s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = $1
      `, [storeId]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}