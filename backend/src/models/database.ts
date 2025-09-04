import { Pool } from 'pg';

const isDevelopment = process.env.NODE_ENV !== 'production';

// PostgreSQL connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'burnana_pos',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    
    try {
      // Create Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          business_registration_number VARCHAR(50) NOT NULL,
          store_name VARCHAR(200) NOT NULL,
          owner_name VARCHAR(100) NOT NULL,
          phone_number VARCHAR(20) NOT NULL,
          email VARCHAR(200) NOT NULL UNIQUE,
          store_address TEXT NOT NULL,
          naver_store_link TEXT,
          store_number VARCHAR(20) NOT NULL UNIQUE,
          user_pin VARCHAR(4) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Places table
      await client.query(`
        CREATE TABLE IF NOT EXISTS places (
          id SERIAL PRIMARY KEY,
          store_number VARCHAR(100) NOT NULL,
          name VARCHAR(200) NOT NULL,
          color VARCHAR(7) NOT NULL,
          table_count INTEGER DEFAULT 0,
          user_pin VARCHAR(20) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Tables table
      await client.query(`
        CREATE TABLE IF NOT EXISTS tables (
          id SERIAL PRIMARY KEY,
          place_id INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
          name VARCHAR(200) NOT NULL,
          color VARCHAR(7) NOT NULL,
          position_x INTEGER DEFAULT 0,
          position_y INTEGER DEFAULT 0,
          store_number VARCHAR(100) NOT NULL,
          user_pin VARCHAR(20) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Logs table
      await client.query(`
        CREATE TABLE IF NOT EXISTS logs (
          id SERIAL PRIMARY KEY,
          type VARCHAR(50) NOT NULL,
          message TEXT NOT NULL,
          user_pin VARCHAR(20),
          store_number VARCHAR(100),
          metadata TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create indexes for better performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_users_store_number ON users(store_number)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_places_store_number ON places(store_number)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_logs_store_number ON logs(store_number)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_logs_type ON logs(type)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_tables_place_id ON tables(place_id)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_tables_store_number ON tables(store_number)
      `);

      console.log('✅ PostgreSQL database tables initialized successfully');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error initializing PostgreSQL database:', error);
    throw error;
  }
};

export interface PlaceRecord {
  id?: number;
  store_number: string;
  name: string;
  color: string;
  table_count: number;
  user_pin: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface TableRecord {
  id?: number;
  place_id: number;
  name: string;
  color: string;
  position_x: number;
  position_y: number;
  store_number: string;
  user_pin: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface LogRecord {
  id?: number;
  type: string;
  message: string;
  user_pin?: string;
  store_number?: string;
  metadata?: string;
  created_at?: Date;
}

export { pool };