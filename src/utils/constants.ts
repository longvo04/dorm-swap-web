import type { Category, ItemCondition, ListingType } from '@/types';

export const APP_NAME = 'DormSwap';

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'textbooks', label: 'Textbooks', icon: '📚' },
  { id: 'electronics', label: 'Electronics', icon: '💻' },
  { id: 'furniture', label: 'Household', icon: '🏠' },
  { id: 'uniforms-outfits', label: 'Uniforms/Outfits', icon: '👔' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'others', label: 'Other', icon: '📦' },
];

export const CONDITIONS: { value: ItemCondition; label: string; description: string }[] = [
  { value: '100% New', label: '100% New', description: 'Brand new, never used, in original packaging.' },
  { value: 'Like New', label: 'Like New', description: 'Barely used, no visible wear, works perfectly.' },
  { value: 'Good', label: 'Good', description: 'Used regularly, works perfectly, shows minor scratches/wear.' },
  { value: 'Acceptable', label: 'Acceptable', description: 'Shows wear, fully functional, may have cosmetic issues.' },
];

export const LISTING_TYPES: { value: ListingType; label: string }[] = [
  { value: 'sell', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
];

export const DORM_BUILDINGS = [
  'A1', 'A2', 'A3', 'A4', 'A5',
  'B1', 'B2', 'B3', 'B4', 'B5',
];

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ITEM_DETAILS: '/items/:id',
  PAYMENT: '/items/:id/payment',
  POST_ITEM: '/post',
  EDIT_ITEM: '/items/:id/edit',
  VIEW_MY_ITEM: '/my-items/:id',
  MY_LISTINGS: '/my-listings',
  PROFILE: '/profile',
  EDIT_PROFILE: '/profile/edit',
  CHAT: '/chat',
  CHAT_CONVERSATION: '/chat/:id',
  NOTIFICATIONS: '/notifications',
  TRANSACTIONS: '/transactions',
  BILLING: '/billing',
  ADMIN: '/admin',
  VIEW_POST: '/admin/posts/:id',
  VIEW_REPORT: '/admin/reports/:id',
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ITEMS_PER_PAGE = 20;

