import { useState, useCallback, useMemo } from 'react';
import type { Item, ItemFilters, Category, ListingType, ItemCondition } from '@/types';

// Mock data for development
const MOCK_ITEMS: Item[] = [
  // Items owned by current user (sellerId: '1')
  {
    id: '1',
    title: 'Calculus Textbook (10th Ed)',
    description: 'Gently used Calculus textbook, 10th edition. Perfect for students taking MATH 101 or MATH 102. All pages are intact with minimal highlighting. Includes access code (unused). Purchased last semester but switching majors, so no longer need it. Great condition overall!',
    price: 850000,
    category: 'textbooks',
    condition: 'Good',
    listingType: 'sell',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'],
    sellerId: '1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Study Lamp (LED)',
    description: 'Pink LED study lamp with adjustable brightness. Perfect for late night study sessions. Energy efficient and stylish.',
    price: 500000,
    category: 'appliances',
    condition: '100% New',
    listingType: 'sell',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400'],
    sellerId: '1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Coffee Maker',
    description: 'Compact espresso coffee maker. Makes great coffee for those early morning classes. Includes all accessories.',
    price: 625000,
    category: 'appliances',
    condition: 'Good',
    listingType: 'rent',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400'],
    sellerId: '1',
    rentalDeposit: 200000,
    rentalPeriodDays: 30,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    title: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation. Great for studying in noisy dorms.',
    price: 1125000,
    category: 'electronics',
    condition: 'Acceptable',
    listingType: 'sell',
    status: 'sold', // Pending status for demo
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    sellerId: '1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  // Items from other users
  {
    id: '5',
    title: 'Desk Fan - Like New',
    description: 'Powerful desk fan, perfect for hot dorm rooms. Quiet operation and adjustable speed.',
    price: 375000,
    category: 'appliances',
    condition: 'Like New',
    listingType: 'sell',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    sellerId: '2',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '6',
    title: 'Mountain Bike',
    description: 'Great mountain bike for getting around campus. Recently serviced, new tires.',
    price: 3000000,
    category: 'sports',
    condition: 'Acceptable',
    listingType: 'sell',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    sellerId: '2',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: '7',
    title: 'Mini Fridge - Excellent Condition',
    description: 'Compact mini fridge perfect for dorm rooms. Energy efficient and quiet.',
    price: 1500000,
    category: 'appliances',
    condition: 'Good',
    listingType: 'sell',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    sellerId: '3',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: '8',
    title: 'MacBook Pro 2019',
    description: '13-inch MacBook Pro, great for coding and design work. Comes with charger and case.',
    price: 11250000,
    category: 'electronics',
    condition: 'Like New',
    listingType: 'sell',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    sellerId: '4',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '9',
    title: 'Ergonomic Study Chair',
    description: 'Comfortable ergonomic chair, perfect for long study sessions. Adjustable height and armrests.',
    price: 1125000,
    category: 'furniture',
    condition: 'Acceptable',
    listingType: 'sell',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    sellerId: '5',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    id: '10',
    title: 'Art Supplies Set',
    description: 'Complete art supplies set including brushes, paints, and canvas. Great for art students.',
    price: 450000,
    category: 'stationery',
    condition: '100% New',
    listingType: 'sell',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    sellerId: '6',
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
  },
  {
    id: '11',
    title: 'University Hoodie - Size M',
    description: 'Official university hoodie, barely worn. Size M, great for campus events.',
    price: 450000,
    category: 'uniforms-outfits',
    condition: 'Like New',
    listingType: 'sell',
    status: 'available',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    sellerId: '7',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

interface UseItemsReturn {
  items: Item[];
  filteredItems: Item[];
  isLoading: boolean;
  error: string | null;
  filters: ItemFilters;
  setFilters: (filters: ItemFilters) => void;
  searchItems: (query: string) => void;
  getItemById: (id: string) => Item | undefined;
  createItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Item>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<Item>;
  deleteItem: (id: string) => Promise<void>;
}

export function useItems(): UseItemsReturn {
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [filters, setFilters] = useState<ItemFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter items based on current filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Category filter
      if (filters.category && item.category !== filters.category) {
        return false;
      }

      // Listing type filter
      if (filters.listingType && item.listingType !== filters.listingType) {
        return false;
      }

      // Condition filter
      if (filters.condition && item.condition !== filters.condition) {
        return false;
      }

      // Price range filter
      if (filters.minPrice !== undefined && item.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && item.price > filters.maxPrice) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(searchLower);
        const matchesDescription = item.description.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) {
          return false;
        }
      }

      // Only show available items
      return item.status === 'available';
    });
  }, [items, filters]);

  const searchItems = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, search: query || undefined }));
  }, []);

  const getItemById = useCallback((id: string) => {
    return items.find(item => item.id === id);
  }, [items]);

  const createItem = useCallback(async (
    itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<Item> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      const newItem: Item = {
        ...itemData,
        id: String(Date.now()),
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create item';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (id: string, updates: Partial<Item>): Promise<Item> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      let updatedItem: Item | undefined;
      
      setItems(prev => prev.map(item => {
        if (item.id === id) {
          updatedItem = { ...item, ...updates, updatedAt: new Date() };
          return updatedItem;
        }
        return item;
      }));
      
      if (!updatedItem) {
        throw new Error('Item not found');
      }
      
      return updatedItem;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update item';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call (soft delete)
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'removed' as const } : item
      ));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete item';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    items,
    filteredItems,
    isLoading,
    error,
    filters,
    setFilters,
    searchItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
  };
}

// Re-export types for convenience
export type { Item, ItemFilters, Category, ListingType, ItemCondition };

