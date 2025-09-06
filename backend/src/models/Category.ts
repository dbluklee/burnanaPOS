import { pool, CategoryRecord } from './database';

export class Category {
  static async create(category: Omit<CategoryRecord, 'id' | 'created_at' | 'updated_at'>): Promise<CategoryRecord> {
    const client = await pool.connect();
    try {
      // Get the next sort_order value (max + 1)
      const orderResult = await client.query('SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM categories WHERE store_number = $1', [category.store_number]);
      const nextOrder = orderResult.rows[0].next_order;
      
      const result = await client.query(
        `INSERT INTO categories (store_number, name, color, menu_count, user_pin, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [category.store_number, category.name, category.color, category.menu_count, category.user_pin, nextOrder]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findAll(): Promise<CategoryRecord[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT c.*, 
               COALESCE(COUNT(m.id), 0) as menu_count
        FROM categories c
        LEFT JOIN menus m ON c.id = m.category_id
        GROUP BY c.id
        ORDER BY c.sort_order ASC, c.created_at DESC
      `);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findById(id: number): Promise<CategoryRecord> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT c.*, 
                COALESCE(COUNT(m.id), 0) as menu_count
         FROM categories c
         LEFT JOIN menus m ON c.id = m.category_id
         WHERE c.id = $1
         GROUP BY c.id`,
        [id]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Category not found');
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async update(id: number, updates: Partial<CategoryRecord>): Promise<CategoryRecord> {
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
      if (updates.menu_count !== undefined) {
        fields.push(`menu_count = $${paramCount++}`);
        values.push(updates.menu_count);
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
      
      const sql = `UPDATE categories SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
      
      const result = await client.query(sql, values);
      
      if (result.rows.length === 0) {
        throw new Error('Category not found');
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async delete(id: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM categories WHERE id = $1', [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } finally {
      client.release();
    }
  }

  static async findByStoreNumber(storeNumber: string): Promise<CategoryRecord[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT c.*, 
                COALESCE(COUNT(m.id), 0) as menu_count
         FROM categories c
         LEFT JOIN menus m ON c.id = m.category_id
         WHERE c.store_number = $1
         GROUP BY c.id
         ORDER BY c.sort_order ASC, c.created_at DESC`,
        [storeNumber]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findByName(name: string, storeNumber?: string): Promise<CategoryRecord | null> {
    const client = await pool.connect();
    try {
      let sql = 'SELECT * FROM categories WHERE name = $1';
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
      let sql = 'DELETE FROM categories WHERE name = $1';
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

  static async updateOrder(categoryOrders: { id: number; sort_order: number }[]): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const item of categoryOrders) {
        await client.query(
          'UPDATE categories SET sort_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
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