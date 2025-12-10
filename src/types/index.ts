// User Types

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  dorm_building?: string;
  dorm_room?: string;
  roomNumber?: string;
  is_admin: boolean;
  is_verified_student: boolean;
}

export interface UserSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  user: User;
}

// Item Types
export type ListingType = 'sell' | 'rent';
export type ItemCondition = '100% New' | 'Like New' | 'Good' | 'Acceptable';
export type ItemStatus = 'available' | 'sold' | 'rented' | 'removed';

export type Category = 
  | 'textbooks'
  | 'electronics'
  | 'sports'
  | 'furniture'
  | 'appliances'
  | 'uniforms-outfits'
  | 'stationery'
  | 'others';

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: ItemCondition;
  listingType: ListingType;
  status: ItemStatus;
  images: string[];
  sellerId: string;
  seller?: User;
  // Rental specific
  rentalDeposit?: number;
  rentalPeriodDays?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemFilters {
  category?: Category;
  listingType?: ListingType;
  condition?: ItemCondition;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Transaction Types
export type TransactionStatus = 
  | 'pending'
  | 'deposit_paid'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface Transaction {
  id: string;
  itemId: string;
  item?: Item;
  buyerId: string;
  buyer?: User;
  sellerId: string;
  seller?: User;
  type: ListingType;
  amount: number;
  depositAmount?: number;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Chat Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  itemId: string;
  item?: Item;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

