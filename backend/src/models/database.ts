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
      // Create Users table (for authentication and user management)
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          phone VARCHAR(20) NOT NULL UNIQUE,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(200) UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Stores table (business/store information)
      await client.query(`
        CREATE TABLE IF NOT EXISTS stores (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          business_registration_number VARCHAR(50) NOT NULL,
          store_name VARCHAR(200) NOT NULL,
          owner_name VARCHAR(100) NOT NULL,
          store_address TEXT NOT NULL,
          naver_store_link TEXT,
          store_number VARCHAR(20) NOT NULL UNIQUE,
          user_pin VARCHAR(4) NOT NULL,
          pre_work BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Places table
      await client.query(`
        CREATE TABLE IF NOT EXISTS places (
          id SERIAL PRIMARY KEY,
          store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
          name VARCHAR(200) NOT NULL,
          color VARCHAR(7) NOT NULL,
          table_count INTEGER DEFAULT 0,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Add sort_order column to places table if it doesn't exist
      await client.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name='places' AND column_name='sort_order') THEN
            ALTER TABLE places ADD COLUMN sort_order INTEGER DEFAULT 0;
          END IF;
        END $$
      `);

      // Create Tables table
      await client.query(`
        CREATE TABLE IF NOT EXISTS tables (
          id SERIAL PRIMARY KEY,
          store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
          place_id INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
          name VARCHAR(200) NOT NULL,
          color VARCHAR(7) NOT NULL,
          dining_capacity INTEGER DEFAULT 4,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Categories table
      await client.query(`
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
          name VARCHAR(200) NOT NULL,
          color VARCHAR(7) NOT NULL,
          menu_count INTEGER DEFAULT 0,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Menus table
      await client.query(`
        CREATE TABLE IF NOT EXISTS menus (
          id SERIAL PRIMARY KEY,
          store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
          category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
          name VARCHAR(200) NOT NULL,
          price INTEGER DEFAULT 0,
          description TEXT,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Logs table
      await client.query(`
        CREATE TABLE IF NOT EXISTS logs (
          id SERIAL PRIMARY KEY,
          store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL,
          message TEXT NOT NULL,
          metadata TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create indexes for better performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_stores_store_number ON stores(store_number)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_places_store_id ON places(store_id)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_tables_store_id ON tables(store_id)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_tables_place_id ON tables(place_id)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_categories_store_id ON categories(store_id)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_menus_store_id ON menus(store_id)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_menus_category_id ON menus(category_id)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_logs_store_id ON logs(store_id)
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_logs_type ON logs(type)
      `);

      // Migrations for multi-tenant structure
      // Add store_id to existing tables that don't have it
      await client.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name='places' AND column_name='store_id') THEN
            ALTER TABLE places ADD COLUMN store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE;
          END IF;
        END $$
      `);
      
      await client.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name='tables' AND column_name='store_id') THEN
            ALTER TABLE tables ADD COLUMN store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE;
          END IF;
        END $$
      `);
      
      await client.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name='categories' AND column_name='store_id') THEN
            ALTER TABLE categories ADD COLUMN store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE;
          END IF;
        END $$
      `);
      
      await client.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name='menus' AND column_name='store_id') THEN
            ALTER TABLE menus ADD COLUMN store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE;
          END IF;
        END $$
      `);
      
      await client.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name='logs' AND column_name='store_id') THEN
            ALTER TABLE logs ADD COLUMN store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE;
          END IF;
        END $$
      `);

      console.log('✅ PostgreSQL database tables initialized successfully');
      
      // Check if pre_work schema was created
      const schemaCheck = await client.query(`SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'pre_work'`);
      if (schemaCheck.rows.length > 0) {
        console.log('✅ pre_work schema verified successfully');
      } else {
        console.log('❌ pre_work schema not found');
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error initializing PostgreSQL database:', error);
    throw error;
  }
};

export interface UserRecord {
  id?: number;
  phone: string;
  name: string;
  email?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface StoreRecord {
  id?: number;
  user_id: number;
  business_registration_number: string;
  store_name: string;
  owner_name: string;
  store_address: string;
  naver_store_link?: string;
  store_number: string;
  user_pin: string;
  pre_work: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface PlaceRecord {
  id?: number;
  store_id: number;
  name: string;
  color: string;
  table_count: number;
  sort_order?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface TableRecord {
  id?: number;
  store_id: number;
  place_id: number;
  name: string;
  color: string;
  dining_capacity: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CategoryRecord {
  id?: number;
  store_id: number;
  name: string;
  color: string;
  menu_count: number;
  sort_order?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface MenuRecord {
  id?: number;
  store_id: number;
  category_id: number;
  name: string;
  price: number;
  description?: string;
  sort_order?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface LogRecord {
  id?: number;
  store_id: number;
  type: string;
  message: string;
  metadata?: string;
  created_at?: Date;
}

export { pool };