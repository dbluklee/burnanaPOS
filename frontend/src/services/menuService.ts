const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface MenuData {
  id?: number;
  category_id: number;
  store_number: string;
  name: string;
  price: number;
  description?: string;
  user_pin: string;
  sort_order?: number;
  created_at?: Date;
  updated_at?: Date;
}

class MenuService {
  // Menus API
  async createMenu(menu: Omit<MenuData, 'id' | 'created_at' | 'updated_at'>): Promise<MenuData> {
    const response = await fetch(`${API_BASE_URL}/menus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menu),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create menu');
    }

    return response.json();
  }

  async getAllMenus(): Promise<MenuData[]> {
    const response = await fetch(`${API_BASE_URL}/menus`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch menus');
    }

    return response.json();
  }

  async getMenusByStore(storeNumber: string): Promise<MenuData[]> {
    const response = await fetch(`${API_BASE_URL}/menus/store/${storeNumber}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch menus');
    }

    return response.json();
  }

  async getMenusByCategory(categoryId: number): Promise<MenuData[]> {
    const response = await fetch(`${API_BASE_URL}/menus/category/${categoryId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch menus');
    }

    return response.json();
  }

  async getMenuById(id: number): Promise<MenuData> {
    const response = await fetch(`${API_BASE_URL}/menus/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch menu');
    }

    return response.json();
  }

  async updateMenu(id: number, updates: Partial<MenuData>): Promise<MenuData> {
    const response = await fetch(`${API_BASE_URL}/menus/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update menu');
    }

    return response.json();
  }

  async deleteMenu(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/menus/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete menu');
    }
  }

  // Update menu order
  async updateMenuOrder(menuOrders: { id: number; sort_order: number }[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/menus/order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ menuOrders }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update menu order');
    }
  }
}

export const menuService = new MenuService();