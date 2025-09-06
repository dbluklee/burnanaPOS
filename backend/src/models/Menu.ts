import { pool, MenuRecord } from './database';

export class Menu {
  static async create(menu: Omit<MenuRecord, 'id' | 'created_at' | 'updated_at'>): Promise<MenuRecord> {
    const client = await pool.connect();
    try {
      // Get the next sort_order value (max + 1)
      const orderResult = await client.query('SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM menus WHERE category_id = $1', [menu.category_id]);
      const nextOrder = orderResult.rows[0].next_order;
      
      const result = await client.query(
        `INSERT INTO menus (store_id, category_id, name, price, description, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [menu.store_id, menu.category_id, menu.name, menu.price, menu.description, nextOrder]
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async findAll(): Promise<MenuRecord[]> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM menus ORDER BY sort_order ASC, created_at DESC');
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findById(id: number): Promise<MenuRecord> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM menus WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Menu not found');
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async update(id: number, updates: Partial<MenuRecord>): Promise<MenuRecord> {
    const client = await pool.connect();
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;
      
      if (updates.store_id !== undefined) {
        fields.push(`store_id = $${paramCount++}`);
        values.push(updates.store_id);
      }
      if (updates.category_id !== undefined) {
        fields.push(`category_id = $${paramCount++}`);
        values.push(updates.category_id);
      }
      if (updates.name !== undefined) {
        fields.push(`name = $${paramCount++}`);
        values.push(updates.name);
      }
      if (updates.price !== undefined) {
        fields.push(`price = $${paramCount++}`);
        values.push(updates.price);
      }
      if (updates.description !== undefined) {
        fields.push(`description = $${paramCount++}`);
        values.push(updates.description);
      }
      if (updates.sort_order !== undefined) {
        fields.push(`sort_order = $${paramCount++}`);
        values.push(updates.sort_order);
      }
      
      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);
      
      const sql = `UPDATE menus SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
      
      const result = await client.query(sql, values);
      
      if (result.rows.length === 0) {
        throw new Error('Menu not found');
      }
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async delete(id: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM menus WHERE id = $1', [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } finally {
      client.release();
    }
  }

  static async findByStoreId(storeId: number): Promise<MenuRecord[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM menus WHERE store_id = $1 ORDER BY sort_order ASC, created_at DESC',
        [storeId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findByCategory(categoryId: number): Promise<MenuRecord[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM menus WHERE category_id = $1 ORDER BY sort_order ASC, created_at DESC',
        [categoryId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async findByName(name: string, storeId?: number): Promise<MenuRecord | null> {
    const client = await pool.connect();
    try {
      let sql = 'SELECT * FROM menus WHERE name = $1';
      const params: any[] = [name];
      
      if (storeId) {
        sql += ' AND store_id = $2';
        params.push(storeId);
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

  static async deleteByName(name: string, storeId?: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      let sql = 'DELETE FROM menus WHERE name = $1';
      const params: any[] = [name];
      
      if (storeId) {
        sql += ' AND store_id = $2';
        params.push(storeId);
      }
      
      const result = await client.query(sql, params);
      return result.rowCount !== null && result.rowCount > 0;
    } finally {
      client.release();
    }
  }

  static async updateOrder(menuOrders: { id: number; sort_order: number }[]): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const item of menuOrders) {
        await client.query(
          'UPDATE menus SET sort_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
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