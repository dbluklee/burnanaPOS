import { pool, TableRecord } from './database';

export class Table {
  static async create(table: Omit<TableRecord, 'id' | 'created_at' | 'updated_at'>): Promise<TableRecord> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO tables (place_id, name, color, position_x, position_y, dining_capacity, store_number, user_pin)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [table.place_id, table.name, table.color, table.position_x, table.position_y, table.dining_capacity, table.store_number, table.user_pin]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findAll(): Promise<TableRecord[]> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM tables ORDER BY created_at DESC');
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findById(id: number): Promise<TableRecord> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM tables WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Table not found');
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findByPlaceId(placeId: number): Promise<TableRecord[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM tables WHERE place_id = $1 ORDER BY created_at DESC',
        [placeId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findByStoreNumber(storeNumber: string): Promise<TableRecord[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM tables WHERE store_number = $1 ORDER BY created_at DESC',
        [storeNumber]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async update(id: number, updates: Partial<TableRecord>): Promise<TableRecord> {
    const client = await pool.connect();
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;
      
      if (updates.place_id !== undefined) {
        fields.push(`place_id = $${paramCount++}`);
        values.push(updates.place_id);
      }
      if (updates.name !== undefined) {
        fields.push(`name = $${paramCount++}`);
        values.push(updates.name);
      }
      if (updates.color !== undefined) {
        fields.push(`color = $${paramCount++}`);
        values.push(updates.color);
      }
      if (updates.position_x !== undefined) {
        fields.push(`position_x = $${paramCount++}`);
        values.push(updates.position_x);
      }
      if (updates.position_y !== undefined) {
        fields.push(`position_y = $${paramCount++}`);
        values.push(updates.position_y);
      }
      if (updates.dining_capacity !== undefined) {
        fields.push(`dining_capacity = $${paramCount++}`);
        values.push(updates.dining_capacity);
      }
      if (updates.store_number !== undefined) {
        fields.push(`store_number = $${paramCount++}`);
        values.push(updates.store_number);
      }
      if (updates.user_pin !== undefined) {
        fields.push(`user_pin = $${paramCount++}`);
        values.push(updates.user_pin);
      }
      
      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);
      
      const sql = `UPDATE tables SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
      
      const result = await client.query(sql, values);
      
      if (result.rows.length === 0) {
        throw new Error('Table not found');
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async delete(id: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM tables WHERE id = $1', [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } finally {
      client.release();
    }
  }

  static async findByName(name: string, placeId?: number): Promise<TableRecord | null> {
    const client = await pool.connect();
    try {
      let sql = 'SELECT * FROM tables WHERE name = $1';
      const params = [name];
      
      if (placeId) {
        sql += ' AND place_id = $2';
        params.push(placeId.toString());
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

  static async deleteByName(name: string, placeId?: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      let sql = 'DELETE FROM tables WHERE name = $1';
      const params = [name];
      
      if (placeId) {
        sql += ' AND place_id = $2';
        params.push(placeId.toString());
      }
      
      const result = await client.query(sql, params);
      return result.rowCount !== null && result.rowCount > 0;
    } finally {
      client.release();
    }
  }
}