const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface CategoryData {
  id?: number;
  store_number: string;
  name: string;
  color: string;
  menu_count: number;
  user_pin: string;
  sort_order?: number;
  created_at?: Date;
  updated_at?: Date;
}

class CategoryService {
  // Categories API
  async createCategory(category: Omit<CategoryData, 'id' | 'created_at' | 'updated_at'>): Promise<CategoryData> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create category');
    }

    return response.json();
  }

  async getAllCategories(): Promise<CategoryData[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  }

  async getCategoriesByStore(storeNumber: string): Promise<CategoryData[]> {
    const response = await fetch(`${API_BASE_URL}/categories/store/${storeNumber}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  }

  async getCategoryById(id: number): Promise<CategoryData> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch category');
    }

    return response.json();
  }

  async updateCategory(id: number, updates: Partial<CategoryData>): Promise<CategoryData> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update category');
    }

    return response.json();
  }

  async deleteCategory(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete category');
    }
  }

  // Update category order
  async updateCategoryOrder(categoryOrders: { id: number; sort_order: number }[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/categories/order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryOrders }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update category order');
    }
  }
}

export const categoryService = new CategoryService();