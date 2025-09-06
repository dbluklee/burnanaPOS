const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

export interface TableData {
  id?: number;
  place_id: number;
  name: string;
  color: string;
  dining_capacity: number;
  store_number: string;
  user_pin: string;
  created_at?: Date;
  updated_at?: Date;
}

class TableService {
  async createTable(table: Omit<TableData, 'id' | 'created_at' | 'updated_at'>): Promise<TableData> {
    const response = await fetch(`${API_BASE_URL}/tables`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(table),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create table');
    }

    return response.json();
  }

  async getAllTables(): Promise<TableData[]> {
    const response = await fetch(`${API_BASE_URL}/tables`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tables');
    }

    return response.json();
  }

  async getTablesByStore(storeNumber: string): Promise<TableData[]> {
    const response = await fetch(`${API_BASE_URL}/tables/store/${storeNumber}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tables');
    }

    return response.json();
  }

  async getTablesByPlace(placeId: number): Promise<TableData[]> {
    const response = await fetch(`${API_BASE_URL}/tables/place/${placeId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tables');
    }

    return response.json();
  }

  async getTableById(id: number): Promise<TableData> {
    const response = await fetch(`${API_BASE_URL}/tables/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch table');
    }

    return response.json();
  }

  async updateTable(id: number, updates: Partial<TableData>): Promise<TableData> {
    const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update table');
    }

    return response.json();
  }

  async deleteTable(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete table');
    }
  }
}

export const tableService = new TableService();