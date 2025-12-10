import { useState, useCallback, useMemo, useEffect } from 'react';
import { getItems, getItemDetails } from '@/api/items';
import { createPost, updatePost } from '@/api/posts';
import { deleteUserItem } from '@/api/profile';
import { CATEGORIES } from '@/utils/constants';
import type { Item, ItemFilters, Category, ListingType, ItemCondition, ItemStatus } from '@/types';

function categoryToId(category?: Category): number | undefined {
  if (!category) return undefined;
  const idx = CATEGORIES.findIndex(c => c.id === category);
  return idx >= 0 ? idx + 1 : undefined;
}

function idToCategory(category_id?: number | string): Category {
  const idx = typeof category_id === 'string' ? Number(category_id) - 1 : (category_id ?? 0) - 1;
  return CATEGORIES[idx]?.id ?? 'others';
}

interface ApiItem {
  id?: string;
  item_id?: string;
  title?: string;
  description?: string;
  price?: number | string;
  category_id?: number | string;
  item_condition?: ItemCondition;
  listing_type?: ListingType;
  status?: ItemStatus;
  images?: string[];
  image?: string;
  image_urls?: string[];
  seller_id?: string;
  rental_details?: {
    deposit_amount?: number;
    min_rent_period?: number;
    max_rent_period?: number;
  };
  created_at?: string;
  updated_at?: string;
}

function mapApiItem(raw: ApiItem): Item {
  // Map condition from API to ItemCondition type
  const validConditions: ItemCondition[] = ['100% New', 'Like New', 'Good', 'Acceptable'];
  let condition: ItemCondition = 'Good';
  
  // Check both item_condition and condition fields (in case API uses different field name)
  const apiConditionValue = raw.item_condition ?? (raw as unknown as { condition?: string }).condition;
  
  if (apiConditionValue) {
    const apiCondition = String(apiConditionValue).trim();
    // Try exact match first
    if (validConditions.includes(apiCondition as ItemCondition)) {
      condition = apiCondition as ItemCondition;
    } else {
      // Try case-insensitive match
      const matched = validConditions.find(c => 
        c.toLowerCase() === apiCondition.toLowerCase()
      );
      if (matched) {
        condition = matched;
      } else {
        // Log for debugging if condition doesn't match
        console.warn('Unknown condition value from API:', apiCondition, 'Defaulting to Good');
      }
    }
  }
  
  return {
    id: raw.id ?? raw.item_id ?? String(raw.title ?? Math.random()),
    title: raw.title ?? 'Untitled',
    description: raw.description ?? '',
    price: Number(raw.price ?? 0),
    category: idToCategory(raw.category_id),
    condition,
    listingType: (raw.listing_type as ListingType) ?? 'sell',
    status: (raw.status as ItemStatus | undefined) ?? 'available',
    images: raw.images ?? raw.image_urls ?? raw.image ? [raw.image ?? ''] : [],
    sellerId: raw.seller_id ?? 'unknown',
    rentalDeposit: raw.rental_details?.deposit_amount,
    rentalPeriodDays: raw.rental_details?.min_rent_period,
    createdAt: raw.created_at ? new Date(raw.created_at) : new Date(),
    updatedAt: raw.updated_at ? new Date(raw.updated_at) : new Date(),
  };
}

interface UseItemsReturn {
  items: Item[];
  filteredItems: Item[];
  isLoading: boolean;
  error: string | null;
  filters: ItemFilters;
  setFilters: (filters: ItemFilters) => void;
  searchItems: (query: string) => void;
  getItemById: (id: string) => Promise<Item | undefined>;
  createItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Item>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<Item>;
  deleteItem: (id: string) => Promise<void>;
}

export function useItems(): UseItemsReturn {
  const [items, setItems] = useState<Item[]>([]);
  const [filters, setFilters] = useState<ItemFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial load from API
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getItems<ApiItem[] | { items?: ApiItem[]; data?: ApiItem[] }>({
          listing_type: filters.listingType,
          item_condition: filters.condition,
          min_price: filters.minPrice,
          max_price: filters.maxPrice,
          category_id: categoryToId(filters.category),
          page: 1,
          limit: 50,
        });
        const data = Array.isArray(response)
          ? response
          : response.items ?? response.data ?? [];
        const mappedItems = data.map(mapApiItem);
        setItems(mappedItems);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load items';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [filters.category, filters.condition, filters.listingType, filters.maxPrice, filters.minPrice]);

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

  const getItemById = useCallback(async (id: string): Promise<Item | undefined> => {
    try {
      const response = await getItemDetails<ApiItem>(id);
      return mapApiItem(response);
    } catch (err) {
      console.error('Failed to fetch item:', err);
      return undefined;
    }
  }, []);

  const createItem = useCallback(async (
    itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<Item> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const category_id = categoryToId(itemData.category) ?? 0;
      const payload = {
        seller_id: itemData.sellerId ?? 'demo-seller',
        category_id,
        title: itemData.title,
        description: itemData.description,
        price: itemData.price,
        item_condition: itemData.condition,
        listing_type: itemData.listingType,
        status: 'available' as ItemStatus,
      };

      const response = await createPost<ApiItem>(payload, []);
      const data = response;
      const mapped = mapApiItem({ ...payload, ...data });
      setItems(prev => [mapped, ...prev]);
      return mapped;
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
      const existing = items.find(i => i.id === id);
      if (!existing) {
        throw new Error('Item not found');
      }

      const category_id = categoryToId(updates.category ?? existing.category) ?? 0;
      const payload = {
        seller_id: existing.sellerId ?? 'demo-seller',
        category_id,
        title: updates.title ?? existing.title,
        description: updates.description ?? existing.description,
        price: updates.price ?? existing.price,
        item_condition: (updates.condition ?? existing.condition) as ItemCondition,
        listing_type: (updates.listingType ?? existing.listingType) as ListingType,
        status: (updates.status ?? existing.status) as ItemStatus,
      };

      const response = await updatePost<ApiItem>(id, payload, []);
      const data = response;
      const mapped = mapApiItem({ ...existing, ...payload, ...data });

      setItems(prev => prev.map(item => item.id === id ? mapped : item));
      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update item';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [items]);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const target = items.find(i => i.id === id);
      if (target?.sellerId) {
        await deleteUserItem(target.sellerId, id);
      }
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete item';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [items]);

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

