import { pool, PlaceRecord } from './database';

export class Place {
  static async create(place: Omit<PlaceRecord, 'id' | 'created_at' | 'updated_at'>): Promise<PlaceRecord> {
    const client = await pool.connect();
    try {
      // Get the next sort_order value (max + 1)
      const orderResult = await client.query('SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM places WHERE store_number = $1', [place.store_number]);
      const nextOrder = orderResult.rows[0].next_order;
      
      const result = await client.query(
        `INSERT INTO places (store_number, name, color, table_count, user_pin, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [place.store_number, place.name, place.color, place.table_count, place.user_pin, nextOrder]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findAll(): Promise<PlaceRecord[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT p.*, 
               COALESCE(COUNT(t.id), 0) as table_count
        FROM places p
        LEFT JOIN tables t ON p.id = t.place_id
        GROUP BY p.id
        ORDER BY p.sort_order ASC, p.created_at DESC
      `);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findById(id: number): Promise<PlaceRecord> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT p.*, 
                COALESCE(COUNT(t.id), 0) as table_count
         FROM places p
         LEFT JOIN tables t ON p.id = t.place_id
         WHERE p.id = $1
         GROUP BY p.id`,
        [id]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Place not found');
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async update(id: number, updates: Partial<PlaceRecord>): Promise<PlaceRecord> {
    const client = await pool.connect();
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;
      
      if (updates.store_number !== undefined) {
        fields.push(`store_number = $${paramCount++}`);
        values.push(updates.store_number);
      }
      if (updates.name !== undefined) {
        fields.push(`name = $${paramCount++}`);
        values.push(updates.name);
      }
      if (updates.color !== undefined) {
        fields.push(`color = $${paramCount++}`);
        values.push(updates.color);
      }
      if (updates.table_count !== undefined) {
        fields.push(`table_count = $${paramCount++}`);
        values.push(updates.table_count);
      }
      if (updates.user_pin !== undefined) {
        fields.push(`user_pin = $${paramCount++}`);
        values.push(updates.user_pin);
      }
      if (updates.sort_order !== undefined) {
        fields.push(`sort_order = $${paramCount++}`);
        values.push(updates.sort_order);
      }
      
      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);
      
      const sql = `UPDATE places SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
      
      const result = await client.query(sql, values);
      
      if (result.rows.length === 0) {
        throw new Error('Place not found');
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async delete(id: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM places WHERE id = $1', [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } finally {
      client.release();
    }
  }

  static async findByStoreNumber(storeNumber: string): Promise<PlaceRecord[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT p.*, 
                COALESCE(COUNT(t.id), 0) as table_count
         FROM places p
         LEFT JOIN tables t ON p.id = t.place_id
         WHERE p.store_number = $1
         GROUP BY p.id
         ORDER BY p.sort_order ASC, p.created_at DESC`,
        [storeNumber]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findByName(name: string, storeNumber?: string): Promise<PlaceRecord | null> {
    const client = await pool.connect();
    try {
      let sql = 'SELECT * FROM places WHERE name = $1';
      const params = [name];
      
      if (storeNumber) {
        sql += ' AND store_number = $2';
        params.push(storeNumber);
      }
      
      sql += ' LIMIT 1';
      
      const result = await client.query(sql, params);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async deleteByName(name: string, storeNumber?: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      let sql = 'DELETE FROM places WHERE name = $1';
      const params = [name];
      
      if (storeNumber) {
        sql += ' AND store_number = $2';
        params.push(storeNumber);
      }
      
      const result = await client.query(sql, params);
      return result.rowCount !== null && result.rowCount > 0;
    } finally {
      client.release();
    }
  }

  static async updateOrder(placeOrders: { id: number; sort_order: number }[]): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const item of placeOrders) {
        await client.query(
          'UPDATE places SET sort_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [item.sort_order, item.id]
        );
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}