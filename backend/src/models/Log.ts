import { pool, LogRecord } from './database';

export class Log {
  static async create(log: Omit<LogRecord, 'id' | 'created_at'>): Promise<LogRecord> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO logs (type, message, user_pin, store_number, metadata)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [log.type, log.message, log.user_pin || null, log.store_number || null, log.metadata || null]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findAll(limit?: number): Promise<LogRecord[]> {
    const client = await pool.connect();
    try {
      let sql = 'SELECT * FROM logs ORDER BY created_at DESC';
      const params: any[] = [];
      
      if (limit) {
        sql += ' LIMIT $1';
        params.push(limit);
      }
      
      const result = await client.query(sql, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findById(id: number): Promise<LogRecord> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM logs WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Log not found');
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByStoreNumber(storeNumber: string, limit?: number): Promise<LogRecord[]> {
    const client = await pool.connect();
    try {
      let sql = 'SELECT * FROM logs WHERE store_number = $1 ORDER BY created_at DESC';
      const params: any[] = [storeNumber];
      
      if (limit) {
        sql += ' LIMIT $2';
        params.push(limit);
      }
      
      const result = await client.query(sql, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findByType(type: string, limit?: number): Promise<LogRecord[]> {
    const client = await pool.connect();
    try {
      let sql = 'SELECT * FROM logs WHERE type = $1 ORDER BY created_at DESC';
      const params: any[] = [type];
      
      if (limit) {
        sql += ' LIMIT $2';
        params.push(limit);
      }
      
      const result = await client.query(sql, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async delete(id: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM logs WHERE id = $1', [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } finally {
      client.release();
    }
  }
}