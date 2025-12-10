import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Camera, Eye, Edit2, Trash2, CreditCard, DollarSign, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { formatPrice } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import type { User, ItemCondition } from '@/types';
import { deleteUserItem, getUserListings, getUserProfile } from '@/api';

// Transaction types and mock data
type TransactionStatus = 'awaiting_meetup' | 'renting' | 'dispute' | 'completed' | 'awaiting_admin' | 'cancelled';
type TransactionTab = 'buying' | 'selling' | 'history';

interface Transaction {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemCondition: ItemCondition;
  transactionId: string;
  status: TransactionStatus;
  otherPartyName: string;
  otherPartyBuilding: string;
  totalValue: number;
  deposit?: number;
  heldByDormSwap?: number;
  returnDate?: string;
  type: 'buy' | 'rent';
  role: 'buyer' | 'seller';
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    itemId: 'item-1',
    itemTitle: 'Calculus Textbook (10th Ed)',
    itemImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200',
    itemCondition: 'Good',
    transactionId: 'TXN-2024-001',
    status: 'awaiting_meetup',
    otherPartyName: 'Emma Chen',
    otherPartyBuilding: 'A3',
    totalValue: 850000,
    heldByDormSwap: 850000,
    type: 'buy',
    role: 'buyer',
  },
  {
    id: '2',
    itemId: 'item-2',
    itemTitle: 'Coffee Maker',
    itemImage: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=200',
    itemCondition: 'Good',
    transactionId: 'TXN-2024-002',
    status: 'renting',
    otherPartyName: 'Michael Tran',
    otherPartyBuilding: 'AG4',
    totalValue: 1125000,
    deposit: 300000,
    heldByDormSwap: 1125000,
    returnDate: '15/12/2025',
    type: 'rent',
    role: 'seller',
  },
  {
    id: '3',
    itemId: 'item-3',
    itemTitle: 'Study Lamp (LED)',
    itemImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200',
    itemCondition: '100% New',
    transactionId: 'TXN-2024-003',
    status: 'dispute',
    otherPartyName: 'Alex Kim',
    otherPartyBuilding: 'A7',
    totalValue: 500000,
    type: 'buy',
    role: 'seller',
  },
  {
    id: '4',
    itemId: 'item-4',
    itemTitle: 'Desk Fan - Like New',
    itemImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
    itemCondition: 'Like New',
    transactionId: 'TXN-2024-004',
    status: 'completed',
    otherPartyName: 'Sofia Martinez',
    otherPartyBuilding: 'A11',
    totalValue: 375000,
    type: 'buy',
    role: 'buyer',
  },
];

interface ProfilePageProps {
  user: User;
  onUpdateUser?: (updates: Partial<User>) => void;
  onLogout?: () => void;
}

type ProfileTab = 'profile' | 'listings' | 'transactions' | 'billing';

interface BankingInfo {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branchName: string;
}

const conditionStyles: Record<ItemCondition, string> = {
  '100% New': 'border-teal-500 text-teal-600 bg-teal-50',
  'Like New': 'border-blue-500 text-blue-600 bg-blue-50',
  'Good': 'border-orange-500 text-orange-600 bg-orange-50',
  'Acceptable': 'border-red-500 text-red-600 bg-red-50',
};

interface ProfileListing {
  id: string;
  title: string;
  price: number;
  condition?: ItemCondition;
  status?: string;
  images?: string[];
  listingType?: string;
}

interface ProfileResponse {
  full_name?: string;
  email?: string;
  avatar_url?: string;
  dorm_building?: string;
  dorm_room?: string;
}

interface ProfileListingResponse {
  id?: string;
  item_id?: string;
  title?: string;
  price?: number | string;
  item_condition?: ItemCondition;
  status?: string;
  images?: string[];
  image_urls?: string[];
  image?: string;
  listing_type?: string;
  type?: string;
}

export function ProfilePage({ user, onLogout }: ProfilePageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get initial tab from URL query parameter
  const getInitialTab = (): ProfileTab => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['profile', 'listings', 'transactions', 'billing'].includes(tabParam)) {
      return tabParam as ProfileTab;
    }
    return 'profile';
  };
  
  const [activeTab, setActiveTab] = useState<ProfileTab>(getInitialTab);
  const [listingFilter, setListingFilter] = useState<'active' | 'pending'>('active');
  const [transactionTab, setTransactionTab] = useState<TransactionTab>('buying');
  const [billingTab, setBillingTab] = useState<'payment' | 'balances'>('payment');
  const [isUpdateBankingOpen, setIsUpdateBankingOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isConfirmReceivedOpen, setIsConfirmReceivedOpen] = useState(false);
  const [isConfirmReturnedOpen, setIsConfirmReturnedOpen] = useState(false);
  const [isReportRefundOpen, setIsReportRefundOpen] = useState(false);
  const [isReportDamageOpen, setIsReportDamageOpen] = useState(false);
  const [damageReason, setDamageReason] = useState('');
  const [damageDescription, setDamageDescription] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [bankingInfo, setBankingInfo] = useState<BankingInfo>({
    bankName: 'VietcomBank',
    accountNumber: '1234567890123',
    accountHolderName: 'NGUYEN VAN A',
    branchName: 'Hanoi Branch',
  });
  const [editBankingInfo, setEditBankingInfo] = useState<BankingInfo>(bankingInfo);
  const [profileData, setProfileData] = useState<User>(user);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [listings, setListings] = useState<ProfileListing[]>([]);
  const [isListingsLoading, setIsListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState<string | null>(null);

  // Fetch profile details
  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      setIsProfileLoading(true);
      setProfileError(null);
      try {
        const response = await getUserProfile<ProfileResponse>(user.user_id);
        const data = (response as ProfileResponse) ?? {};
        if (!isMounted) return;
        const updated: User = {
          ...user,
          full_name: data?.full_name ?? user.full_name,
          email: data?.email ?? user.email,
          avatar_url: data?.avatar_url ?? user.avatar_url,
          dorm_building: data?.dorm_building ?? user.dorm_building,
          dorm_room: data?.dorm_room ?? user.dorm_room,
        };
        setProfileData(updated);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : 'Failed to load profile';
        setProfileError(message);
      } finally {
        if (isMounted) setIsProfileLoading(false);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Fetch user listings
  useEffect(() => {
    let isMounted = true;
    const loadListings = async () => {
      setIsListingsLoading(true);
      setListingsError(null);
      try {
        const response = await getUserListings<ProfileListingResponse[] | { items: ProfileListingResponse[] }>(user.user_id);
        const rawList = Array.isArray(response)
          ? response
          : (response as { items?: ProfileListingResponse[] })?.items ?? [];
        if (!isMounted) return;
        const normalized: ProfileListing[] = rawList.map((item) => ({
          id: item.id ?? item.item_id ?? crypto.randomUUID(),
          title: item.title ?? 'Untitled',
          price: Number(item.price ?? 0),
          condition: item.item_condition,
          status: item.status ?? 'available',
          images: item.images ?? item.image_urls ?? item.image ? [item.image ?? ''] : [],
          listingType: item.listing_type ?? item.type,
        }));
        setListings(normalized);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : 'Failed to load listings';
        setListingsError(message);
      } finally {
        if (isMounted) setIsListingsLoading(false);
      }
    };

    loadListings();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Handle confirm item received (buyer)
  const handleConfirmReceived = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setIsConfirmReceivedOpen(true);
  };

  const confirmItemReceived = () => {
    if (selectedTransaction) {
      setTransactions(prev => prev.map(t => 
        t.id === selectedTransaction.id ? { ...t, status: 'completed' as TransactionStatus } : t
      ));
      setIsConfirmReceivedOpen(false);
      setSelectedTransaction(null);
    }
  };

  // Handle confirm item returned (seller)
  const handleConfirmReturned = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setIsConfirmReturnedOpen(true);
  };

  const confirmItemReturned = () => {
    if (selectedTransaction) {
      // Set to awaiting_admin status (for admin review)
      setTransactions(prev => prev.map(t => 
        t.id === selectedTransaction.id ? { ...t, status: 'awaiting_admin' as TransactionStatus } : t
      ));
      setIsConfirmReturnedOpen(false);
      setSelectedTransaction(null);
    }
  };

  // Handle report item not delivered (buyer) - for refund
  const handleReportNotDelivered = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setIsReportRefundOpen(true);
  };

  const confirmReportRefund = () => {
    if (selectedTransaction) {
      // Set to cancelled status and move to history
      setTransactions(prev => prev.map(t => 
        t.id === selectedTransaction.id ? { ...t, status: 'cancelled' as TransactionStatus } : t
      ));
      setIsReportRefundOpen(false);
      setSelectedTransaction(null);
    }
  };

  // Handle report damage (seller/owner for rental items)
  const handleReportDamage = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setDamageReason('');
    setDamageDescription('');
    setIsReportDamageOpen(true);
  };

  const confirmReportDamage = () => {
    if (selectedTransaction) {
      // Set to awaiting_admin status for admin review
      setTransactions(prev => prev.map(t => 
        t.id === selectedTransaction.id ? { ...t, status: 'awaiting_admin' as TransactionStatus } : t
      ));
      setIsReportDamageOpen(false);
      setSelectedTransaction(null);
      setDamageReason('');
      setDamageDescription('');
    }
  };

  // Navigate to chat with specific user
  const handleChatWith = (userName: string) => {
    const formattedName = userName.toLowerCase().replace(/\s+/g, '-');
    navigate(`${ROUTES.CHAT}?user=${formattedName}`);
  };

  // Get user's items
  const activeItems = listings.filter(item => (item.status ?? 'available') === 'available');
  const pendingItems = listings.filter(item => (item.status ?? '') !== 'available');
console.log(activeItems, pendingItems);
  const handleDelete = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteUserItem(user.user_id, itemId);
        setListings(prev => prev.filter(item => item.id !== itemId));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete item';
        alert(message);
      }
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate(ROUTES.LOGIN);
  };

  const sidebarItems = [
    { id: 'profile' as const, label: 'My Profile' },
    { id: 'listings' as const, label: 'My Listings' },
    { id: 'transactions' as const, label: 'My Transactions' },
    { id: 'billing' as const, label: 'My Billing Information' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Link */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <Card className="border border-gray-200 p-2">
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg font-medium transition-colors",
                      activeTab === item.id
                        ? "bg-green-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </nav>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Card */}
                <Card className="border border-gray-200">
                  {profileError && (
                    <div className="mb-3 text-sm text-red-500">{profileError}</div>
                  )}
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar name={profileData.full_name} src={profileData.avatar_url} size="xl" />
                      <button
                        className="absolute bottom-0 right-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center shadow hover:bg-gray-300 transition-colors"
                      >
                        <Camera className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {isProfileLoading ? 'Loading...' : profileData.full_name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-500">{profileData.email}</span>
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded">
                          Verified
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2">
                        Dorm: {profileData.dorm_building || 'A3'} • Room {profileData.dorm_room || '501'}
                      </p>
                      <Button
                        onClick={() => navigate('/profile/edit')}
                        className="mt-4 bg-green-500 hover:bg-green-600 text-white"
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Statistics */}
                <Card className="border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <div className="text-3xl font-light text-blue-500">
                        {isListingsLoading ? '...' : activeItems.length}
                      </div>
                      <div className="text-gray-500 mt-1">Active Listings</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <div className="text-3xl font-light text-green-500">
                        {isListingsLoading ? '...' : pendingItems.length}
                      </div>
                      <div className="text-gray-500 mt-1">Pending/Other</div>
                    </div>
                  </div>
        </Card>

                {/* Recent Activity */}
                <Card className="border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {/* Activity Item 1 */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100"
                          alt="Desk Fan"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Sold "Desk Fan"</p>
                        <p className="text-sm text-gray-500">Completed 2 days ago</p>
                      </div>
                      <span className="text-green-500 font-medium">+đ375,000</span>
                    </div>

                    {/* Activity Item 2 */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100"
                          alt="Calculus Textbook"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Posted "Calculus Textbook"</p>
                        <p className="text-sm text-gray-500">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'listings' && (
              <Card className="border border-gray-200">
                <h3 className="text-lg font-medium text-green-600 mb-6">My Listings</h3>
                
                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-full p-1 mb-6">
                  <button
                    onClick={() => setListingFilter('active')}
                    className={cn(
                      "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-colors",
                      listingFilter === 'active'
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    Active ({activeItems.length})
                  </button>
                  <button
                    onClick={() => setListingFilter('pending')}
                    className={cn(
                      "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-colors",
                      listingFilter === 'pending'
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    Pending ({pendingItems.length})
                  </button>
                </div>

                {/* Listings */}
                <div className="space-y-4">
                  {isListingsLoading && (
                    <div className="text-center py-12 text-gray-500">Loading listings...</div>
                  )}

                  {!isListingsLoading && listingsError && (
                    <div className="text-center py-12 text-red-500">{listingsError}</div>
                  )}

                  {!isListingsLoading && !listingsError && (
                    <>
                      {(listingFilter === 'active' ? activeItems : pendingItems).map(item => (
                        <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-xl">
                          <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={item.images?.[0] || '/placeholder.jpg'}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-gray-900">{item.title}</h4>
                              {listingFilter === 'pending' && (
                                <span className="px-2 py-0.5 bg-orange-400 text-white text-xs font-medium rounded">
                                  Pending Review
                                </span>
                              )}
                            </div>
                            {item.condition && (
                              <span className={cn(
                                "inline-block px-2.5 py-0.5 text-xs font-medium rounded border mt-2",
                                conditionStyles[item.condition] ?? 'border-gray-200 text-gray-600 bg-gray-50'
                              )}>
                                {item.condition}
                              </span>
                            )}
                            <p className="text-lg font-light text-green-500 mt-2">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/my-items/${item.id}`)}
                              className="flex items-center gap-1.5 rounded-lg"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/items/${item.id}/edit`)}
                              className="flex items-center gap-1.5 rounded-lg"
                            >
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="flex items-center gap-1.5 text-red-500 border-red-300 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}

                      {(listingFilter === 'active' ? activeItems : pendingItems).length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          No {listingFilter} listings
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'transactions' && (
              <Card className="border border-gray-200">
                <h3 className="text-lg font-medium text-green-600 mb-6">My Transactions</h3>
                
                {/* Transaction Tabs */}
                <div className="flex bg-gray-100 rounded-full p-1 mb-6">
                  <button
                    onClick={() => setTransactionTab('buying')}
                    className={cn(
                      "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-colors",
                      transactionTab === 'buying'
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    Buying/Renting
                  </button>
                  <button
                    onClick={() => setTransactionTab('selling')}
                    className={cn(
                      "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-colors",
                      transactionTab === 'selling'
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    Selling/Owning
                  </button>
                  <button
                    onClick={() => setTransactionTab('history')}
                    className={cn(
                      "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-colors",
                      transactionTab === 'history'
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    History
                  </button>
                </div>

                {/* Transaction List */}
                <div className="space-y-6">
                  {transactions
                    .filter(txn => {
                      if (transactionTab === 'buying') return txn.role === 'buyer' && txn.status !== 'completed' && txn.status !== 'cancelled';
                      if (transactionTab === 'selling') return txn.role === 'seller' && txn.status !== 'completed' && txn.status !== 'cancelled';
                      return txn.status === 'completed' || txn.status === 'cancelled';
                    })
                    .map(txn => (
                      <div key={txn.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        {/* Status Banner */}
                        <div className={cn(
                          "px-4 py-3 text-center text-sm font-semibold text-white",
                          txn.status === 'awaiting_meetup' && "bg-orange-400",
                          txn.status === 'renting' && "bg-orange-400",
                          txn.status === 'dispute' && "bg-red-400",
                          txn.status === 'awaiting_admin' && "bg-red-400",
                          txn.status === 'completed' && "bg-green-500",
                          txn.status === 'cancelled' && "bg-gray-500"
                        )}>
                          {txn.status === 'awaiting_meetup' && 'DEPOSIT PAID - AWAITING MEETUP'}
                          {txn.status === 'renting' && `RENTING - RETURN DUE on ${txn.returnDate}`}
                          {txn.status === 'dispute' && 'TRANSACTION DISPUTE - ADMIN REVIEW'}
                          {txn.status === 'awaiting_admin' && 'TRANSACTION DISPUTE - ADMIN REVIEW'}
                          {txn.status === 'completed' && 'TRANSACTION COMPLETED'}
                          {txn.status === 'cancelled' && 'TRANSACTION CANCELLED - REFUNDED'}
                        </div>

                        {/* Transaction Content */}
                        <div className="p-4">
                          <div className="flex gap-4">
                            {/* Item Image */}
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={txn.itemImage}
                                alt={txn.itemTitle}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Item Info */}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{txn.itemTitle}</h4>
                              <p className="text-sm text-gray-500">ID: {txn.transactionId}</p>
                              <span className={cn(
                                "inline-block px-2.5 py-0.5 text-xs font-medium rounded border mt-1",
                                conditionStyles[txn.itemCondition]
                              )}>
                                {txn.itemCondition}
                              </span>
                              <p className="text-sm text-gray-600 mt-1">
                                With <span className="text-blue-600">{txn.otherPartyName}</span> in <span className="text-blue-600">{txn.otherPartyBuilding}</span>
                              </p>
                            </div>

                            {/* Price Info */}
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm text-gray-500">Total Value:</p>
                              <p className="text-lg font-semibold text-green-600">{formatPrice(txn.totalValue)}</p>
                              {txn.deposit && (
                                <>
                                  <p className="text-sm text-gray-500 mt-2">Deposit:</p>
                                  <p className="text-gray-700">{formatPrice(txn.deposit)}</p>
                                </>
                              )}
                              {txn.heldByDormSwap && txn.status !== 'completed' && (
                                <>
                                  <p className="text-sm text-gray-500 mt-2">Held by DormSwap:</p>
                                  <p className="text-green-600">{formatPrice(txn.heldByDormSwap)}</p>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons - Active Transactions */}
                          {txn.status !== 'completed' && txn.status !== 'dispute' && txn.status !== 'awaiting_admin' && txn.status !== 'cancelled' && (
                            <div className="flex gap-3 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleChatWith(txn.otherPartyName)}
                                className="flex-1 flex items-center justify-center gap-2"
                              >
                                <MessageSquare className="h-4 w-4" />
                                Chat with {txn.role === 'buyer' ? 'Seller' : 'Buyer'}
                              </Button>
                              
                              {txn.status === 'awaiting_meetup' && txn.role === 'buyer' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleConfirmReceived(txn)}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Confirm Item Received
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleReportNotDelivered(txn)}
                                    className="flex-1 border-red-300 text-red-500 hover:bg-red-50 flex items-center justify-center gap-2"
                                  >
                                    <AlertTriangle className="h-4 w-4" />
                                    Report Item not delivered
                                  </Button>
                                </>
                              )}

                              {txn.status === 'renting' && txn.role === 'seller' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleReportDamage(txn)}
                                    className="flex-1 border-red-300 text-red-500 hover:bg-red-50 flex items-center justify-center gap-2"
                                  >
                                    <AlertTriangle className="h-4 w-4" />
                                    Report Damage/Dispute
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleConfirmReturned(txn)}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Confirm Item Returned & OK
                                  </Button>
                                </>
                              )}
                            </div>
                          )}

                          {/* Action Buttons - Dispute/Awaiting Admin */}
                          {(txn.status === 'dispute' || txn.status === 'awaiting_admin') && (
                            <div className="flex gap-3 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 flex items-center justify-center gap-2"
                              >
                                <MessageSquare className="h-4 w-4" />
                                Contact Support
                              </Button>
                              <Button
                                size="sm"
                                disabled
                                className="flex-1 bg-gray-300 text-gray-500 cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                Awaiting Admin Review
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                  {/* Empty State */}
                  {transactions.filter(txn => {
                    if (transactionTab === 'buying') return txn.role === 'buyer' && txn.status !== 'completed' && txn.status !== 'cancelled';
                    if (transactionTab === 'selling') return txn.role === 'seller' && txn.status !== 'completed' && txn.status !== 'cancelled';
                    return txn.status === 'completed' || txn.status === 'cancelled';
                  }).length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No transactions found
                    </div>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'billing' && (
              <Card className="border border-gray-200">
                <h3 className="text-lg font-medium text-green-600 mb-6">My Billing Information</h3>
                
                {/* Billing Tabs */}
                <div className="flex bg-gray-100 rounded-full p-1 mb-6">
                  <button
                    onClick={() => setBillingTab('payment')}
                    className={cn(
                      "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2",
                      billingTab === 'payment'
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <CreditCard className="h-4 w-4" />
                    Payment Method
                  </button>
                  <button
                    onClick={() => setBillingTab('balances')}
                    className={cn(
                      "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2",
                      billingTab === 'balances'
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <DollarSign className="h-4 w-4" />
                    Balances
                  </button>
                </div>

                {/* Payment Method Tab */}
                {billingTab === 'payment' && (
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-semibold text-gray-900">Banking Information</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditBankingInfo(bankingInfo);
                          setIsUpdateBankingOpen(true);
                        }}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        Update
                      </Button>
          </div>

          <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                        <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600">
                          {bankingInfo.bankName}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600">
                          {bankingInfo.accountNumber}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                        <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600">
                          {bankingInfo.accountHolderName}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                        <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600">
                          {bankingInfo.branchName}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Balances Tab */}
                {billingTab === 'balances' && (
                  <div className="border border-gray-200 rounded-xl p-6 space-y-6">
                    <h4 className="font-semibold text-gray-900">Your Earnings</h4>
                    
                    {/* Available Balance */}
                    <div className="bg-green-50 rounded-xl p-6">
                      <p className="text-sm text-green-700 mb-1">Balance available for use</p>
                      <p className="text-3xl font-light text-green-600">350.000 đ</p>
                      <p className="text-sm text-green-600 mt-2">You can withdraw your earnings now</p>
                    </div>

                    {/* Withdrawn to date */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <p className="text-sm text-gray-500 mb-1">Withdrawn to date</p>
                      <p className="text-2xl text-gray-700">1.200.000 đ</p>
                    </div>

                    {/* Withdrawal Method */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Withdrawal Method</p>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-900">
                          <span className="text-green-600 font-medium">{bankingInfo.bankName}</span> - {bankingInfo.accountNumber}
                        </span>
                      </div>
                    </div>

                    {/* Withdraw Button */}
                    <Button
                      onClick={() => setIsWithdrawModalOpen(true)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
                    >
                      Withdraw Earnings
                    </Button>

                    {/* How it works */}
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h5 className="text-sm font-medium text-blue-600 mb-3">How it works</h5>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          Minimum withdrawal: 100.000 đ
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          Funds transferred within 1-3 business days
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          No withdrawal fees
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          Update your banking info in Payment Method tab
                        </li>
                      </ul>
                    </div>
          </div>
                )}
        </Card>
            )}
          </main>
        </div>
      </div>

      {/* Update Banking Information Modal */}
      {isUpdateBankingOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsUpdateBankingOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
              <div className="p-6">
                <h2 className="text-lg font-medium text-green-600 mb-6">Banking Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={editBankingInfo.bankName}
                      onChange={(e) => setEditBankingInfo(prev => ({ ...prev, bankName: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={editBankingInfo.accountNumber}
                      onChange={(e) => setEditBankingInfo(prev => ({ ...prev, accountNumber: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      value={editBankingInfo.accountHolderName}
                      onChange={(e) => setEditBankingInfo(prev => ({ ...prev, accountHolderName: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                    <input
                      type="text"
                      value={editBankingInfo.branchName}
                      onChange={(e) => setEditBankingInfo(prev => ({ ...prev, branchName: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => {
                      setBankingInfo(editBankingInfo);
                      setIsUpdateBankingOpen(false);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsUpdateBankingOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Confirm Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsWithdrawModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Confirm Withdrawal</h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to withdraw <span className="font-semibold text-green-600">350.000 đ</span> to your bank account?
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">Transfer to:</p>
                  <p className="font-semibold text-gray-900">{bankingInfo.bankName}</p>
                  <p className="text-gray-700">{bankingInfo.accountNumber}</p>
                  <p className="text-gray-700">{bankingInfo.accountHolderName}</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // Handle withdrawal
                      alert('Withdrawal request submitted successfully!');
                      setIsWithdrawModalOpen(false);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Confirm Withdrawal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Confirm Item Received Modal (Buyer) */}
      {isConfirmReceivedOpen && selectedTransaction && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setIsConfirmReceivedOpen(false);
              setSelectedTransaction(null);
            }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Confirm Item Received</h2>
                <p className="text-gray-600 mb-6">
                  Have you received the item "<span className="font-semibold">{selectedTransaction.itemTitle}</span>" in good condition?
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">Transaction Details:</p>
                  <p className="font-semibold text-gray-900">{selectedTransaction.itemTitle}</p>
                  <p className="text-gray-700">ID: {selectedTransaction.transactionId}</p>
                  <p className="text-gray-700">From: {selectedTransaction.otherPartyName}</p>
                  <p className="text-green-600 font-semibold mt-2">{formatPrice(selectedTransaction.totalValue)}</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    By confirming, the payment will be released to the seller and the transaction will be marked as completed.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsConfirmReceivedOpen(false);
                      setSelectedTransaction(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmItemReceived}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Confirm Received
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Confirm Item Returned Modal (Seller) */}
      {isConfirmReturnedOpen && selectedTransaction && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setIsConfirmReturnedOpen(false);
              setSelectedTransaction(null);
            }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Confirm Item Returned</h2>
                <p className="text-gray-600 mb-6">
                  Has the item "<span className="font-semibold">{selectedTransaction.itemTitle}</span>" been returned to you in acceptable condition?
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">Transaction Details:</p>
                  <p className="font-semibold text-gray-900">{selectedTransaction.itemTitle}</p>
                  <p className="text-gray-700">ID: {selectedTransaction.transactionId}</p>
                  <p className="text-gray-700">From: {selectedTransaction.otherPartyName}</p>
                  {selectedTransaction.deposit && (
                    <p className="text-gray-700 mt-2">Deposit: {formatPrice(selectedTransaction.deposit)}</p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    By confirming, your request will be submitted for admin review. Once approved, the deposit will be returned to the renter.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsConfirmReturnedOpen(false);
                      setSelectedTransaction(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmItemReturned}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Submit for Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Report Item Not Delivered Modal (Buyer - for refund) */}
      {isReportRefundOpen && selectedTransaction && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setIsReportRefundOpen(false);
              setSelectedTransaction(null);
            }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Report Item Not Delivered</h2>
                <p className="text-gray-600 mb-6">
                  Did you not receive the item "<span className="font-semibold">{selectedTransaction.itemTitle}</span>"?
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">Transaction Details:</p>
                  <p className="font-semibold text-gray-900">{selectedTransaction.itemTitle}</p>
                  <p className="text-gray-700">ID: {selectedTransaction.transactionId}</p>
                  <p className="text-gray-700">Seller: {selectedTransaction.otherPartyName}</p>
                  <p className="text-green-600 font-semibold mt-2">
                    Amount to refund: {formatPrice(selectedTransaction.heldByDormSwap || selectedTransaction.totalValue)}
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800">
                    By confirming this report, the transaction will be cancelled and the full amount will be refunded to your account.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsReportRefundOpen(false);
                      setSelectedTransaction(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmReportRefund}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    Report & Get Refund
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Report Damage/Dispute Modal (Seller/Owner for rental items) */}
      {isReportDamageOpen && selectedTransaction && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setIsReportDamageOpen(false);
              setSelectedTransaction(null);
              setDamageReason('');
              setDamageDescription('');
            }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Report Damage/Dispute</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Please provide details about the issue with this rental transaction.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsReportDamageOpen(false);
                      setSelectedTransaction(null);
                      setDamageReason('');
                      setDamageDescription('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <input
                      type="text"
                      placeholder="e.g., Item damaged, not as described, etc."
                      value={damageReason}
                      onChange={(e) => setDamageReason(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Describe what happened</label>
                    <textarea
                      placeholder="Provide detailed description of the issue..."
                      value={damageDescription}
                      onChange={(e) => setDamageDescription(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
            />
          </div>
                </div>

                <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                      setIsReportDamageOpen(false);
                      setSelectedTransaction(null);
                      setDamageReason('');
                      setDamageDescription('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
                  <Button
                    onClick={confirmReportDamage}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    Send Report
            </Button>
          </div>
              </div>
            </div>
          </div>
        </>
        )}
    </div>
  );
}
