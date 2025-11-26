import axios from 'axios';
import type { Product, Order } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    const { state } = JSON.parse(authStorage);
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
  }
  return config;
});

// Transform backend product format to frontend format
const transformProduct = (backendProduct: Record<string, unknown>): Product => {
  return {
    id: backendProduct.id as string,
    name: backendProduct.name as string,
    brand: (backendProduct.brand as string) || 'Unknown',
    price: Number(backendProduct.price) || 0,
    originalPrice: backendProduct.originalPrice as number | undefined,
    discount: Number(backendProduct.discount) || 0,
    image: (backendProduct.image as string) || (backendProduct.images as string[])?.[0] || '/img/placeholder.jpg',
    images: (backendProduct.images as string[]) || [(backendProduct.image as string) || '/img/placeholder.jpg'],
    category: (backendProduct.category as string) || 'Uncategorized',
    description: (backendProduct.description as string) || (backendProduct.desc as string) || '',
    stock: Number(backendProduct.inStock) || Number(backendProduct.stock) || 0,
    features: (backendProduct.features as string[]) || [],
    specifications: (backendProduct.specifications as Record<string, string>) || {},
  };
};

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/api/products');
    return response.data.map(transformProduct);
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/api/products/${id}`);
    return transformProduct(response.data);
  },

  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const backendProduct = {
      name: product.name,
      brand: product.brand,
      price: product.price,
      discount: product.discount || 0,
      category: product.category,
      inStock: product.stock,
      image: product.image,
      images: product.images,
      description: product.description,
    };
    const response = await api.post('/api/products', backendProduct);
    return transformProduct(response.data);
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const backendProduct: Record<string, unknown> = {};
    if (product.name !== undefined) backendProduct.name = product.name;
    if (product.brand !== undefined) backendProduct.brand = product.brand;
    if (product.price !== undefined) backendProduct.price = product.price;
    if (product.discount !== undefined) backendProduct.discount = product.discount;
    if (product.category !== undefined) backendProduct.category = product.category;
    if (product.stock !== undefined) backendProduct.inStock = product.stock;
    if (product.image !== undefined) backendProduct.image = product.image;
    if (product.images !== undefined) backendProduct.images = product.images;
    if (product.description !== undefined) backendProduct.description = product.description;
    
    const response = await api.put(`/api/products/${id}`, backendProduct);
    return transformProduct(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/products/${id}`);
  },
};

export const orderService = {
  create: async (order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const response = await api.post('/api/orders', order);
    return response.data;
  },

  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/api/orders');
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await api.patch(`/api/orders/${id}/status`, { status });
    return response.data;
  },
};

// Auth Service
export const authService = {
  login: async (username: string, password: string): Promise<{ token: string }> => {
    const response = await api.post('/api/admin/login', {
      user: username,
      pass: password,
    });
    return response.data;
  },
};

// Admin Product Service
export const adminProductService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/api/admin/products');
    return response.data.map(transformProduct);
  },

  create: async (product: Partial<Product>): Promise<Product> => {
    const response = await api.post('/api/admin/products', product);
    return transformProduct(response.data.product);
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/api/admin/products/${id}`, product);
    return transformProduct(response.data.product);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/products/${id}`);
  },

  uploadImage: async (file: File, productId: string): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('productId', productId);
    
    const response = await api.post('/api/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url;
  },

  uploadMultipleImages: async (formData: FormData): Promise<{ urls: string[] }> => {
    const response = await api.post('/api/admin/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteImage: async (url: string): Promise<void> => {
    await api.delete('/api/admin/image', { data: { url } });
  },
};

export default api;
