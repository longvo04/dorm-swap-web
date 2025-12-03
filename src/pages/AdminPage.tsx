import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useItems } from '@/hooks/useItems';
import { formatPrice, formatRelativeTime } from '@/utils/formatters';
import { ROUTES, CATEGORIES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import type { ItemCondition } from '@/types';

type AdminTab = 'posts' | 'reports';

interface PendingPost {
  id: string;
  title: string;
  price: number;
  image: string;
  sellerName: string;
  sellerBuilding: string;
  category: string;
  postedAt: Date;
  listingType: 'sell' | 'rent';
  condition: ItemCondition;
}

// Mock pending posts
const MOCK_PENDING_POSTS: PendingPost[] = [
  {
    id: 'pending-1',
    title: 'Calculus Textbook (10th Edition)',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200',
    sellerName: 'Emma Chen',
    sellerBuilding: 'A3',
    category: 'textbooks',
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    listingType: 'sell',
    condition: 'Good',
  },
  {
    id: 'pending-2',
    title: 'Desk Fan - Like New',
    price: 375000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
    sellerName: 'Jake Thompson',
    sellerBuilding: 'B2',
    category: 'electronics',
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    listingType: 'sell',
    condition: 'Like New',
  },
  {
    id: 'pending-3',
    title: 'Mini Fridge - Excellent Condition',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=200',
    sellerName: 'Michael Park',
    sellerBuilding: 'B1',
    category: 'furniture',
    postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    listingType: 'sell',
    condition: '100% New',
  },
  {
    id: 'pending-4',
    title: 'Study Lamp (LED)',
    price: 500000,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200',
    sellerName: 'Alex Kim',
    sellerBuilding: 'A7',
    category: 'electronics',
    postedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    listingType: 'sell',
    condition: '100% New',
  },
  {
    id: 'pending-5',
    title: 'Coffee Maker',
    price: 1125000,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=200',
    sellerName: 'Michael Tran',
    sellerBuilding: 'AG4',
    category: 'furniture',
    postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    listingType: 'rent',
    condition: 'Good',
  },
  {
    id: 'pending-6',
    title: 'Mountain Bike',
    price: 2500000,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200',
    sellerName: 'Alex Rivera',
    sellerBuilding: 'C1',
    category: 'sports',
    postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    listingType: 'sell',
    condition: 'Like New',
  },
];

interface Report {
  id: string;
  itemTitle: string;
  itemImage: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  description: string;
  reportedAt: Date;
  status: 'pending' | 'resolved' | 'dismissed';
}

// Mock reports
const MOCK_REPORTS: Report[] = [
  {
    id: 'report-1',
    itemTitle: 'Study Lamp (LED)',
    itemImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200',
    reportedBy: 'Alex Kim',
    reportedUser: 'Sarah Johnson',
    reason: 'Item damaged',
    description: 'The lamp was returned with significant damage to the base. The LED functionality is compromised.',
    reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: 'pending',
  },
  {
    id: 'report-2',
    itemTitle: 'Calculus Textbook',
    itemImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200',
    reportedBy: 'Emma Chen',
    reportedUser: 'Jake Thompson',
    reason: 'Not as described',
    description: 'The textbook condition was listed as "Good" but many pages are missing and the cover is torn.',
    reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'pending',
  },
];

export function AdminPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, updateItem } = useItems();
  
  // Get initial tab from URL query parameter
  const getInitialTab = (): AdminTab => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'reports') return 'reports';
    return 'posts';
  };
  
  const [activeTab, setActiveTab] = useState<AdminTab>(getInitialTab);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>(MOCK_PENDING_POSTS);
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);

  // Update tab when URL changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'reports') {
      setActiveTab('reports');
    } else {
      setActiveTab('posts');
    }
  }, [searchParams]);

  const handleSelectPost = (postId: string) => {
    setSelectedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedPosts.size === pendingPosts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(pendingPosts.map(p => p.id)));
    }
  };

  const handleApprovePost = (postId: string) => {
    setPendingPosts(prev => prev.filter(p => p.id !== postId));
    setSelectedPosts(prev => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
    // In real app, would update item status to 'available'
  };

  const handleDeclinePost = (postId: string) => {
    setPendingPosts(prev => prev.filter(p => p.id !== postId));
    setSelectedPosts(prev => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
    // In real app, would update item status to 'removed' or 'rejected'
  };

  const handleBulkApprove = () => {
    selectedPosts.forEach(postId => {
      handleApprovePost(postId);
    });
  };

  const handleBulkDecline = () => {
    selectedPosts.forEach(postId => {
      handleDeclinePost(postId);
    });
  };

  const handleResolveReport = (reportId: string) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'resolved' as const } : r
    ));
  };

  const handleDismissReport = (reportId: string) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'dismissed' as const } : r
    ));
  };

  const pendingReports = reports.filter(r => r.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Link */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Management</h1>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-6">
          <button
            onClick={() => {
              setActiveTab('posts');
              navigate(ROUTES.ADMIN);
            }}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-colors",
              activeTab === 'posts'
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Manage Posts
          </button>
          <button
            onClick={() => {
              setActiveTab('reports');
              navigate(ROUTES.ADMIN + '?tab=reports');
            }}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-colors",
              activeTab === 'reports'
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Manage Reports
          </button>
        </div>

        {/* Manage Posts Tab */}
        {activeTab === 'posts' && (
          <Card className="border border-gray-200">
            {/* Summary and Bulk Actions */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <p className="text-gray-700">
                {pendingPosts.length} pending posts awaiting review
                {selectedPosts.size > 0 && ` (${selectedPosts.size} selected)`}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-gray-700"
                >
                  Select All
                </Button>
                <Button
                  size="sm"
                  onClick={handleBulkApprove}
                  disabled={selectedPosts.size === 0}
                  className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve ({selectedPosts.size})
                </Button>
                <Button
                  size="sm"
                  onClick={handleBulkDecline}
                  disabled={selectedPosts.size === 0}
                  className="bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-300"
                >
                  <X className="h-4 w-4 mr-1" />
                  Decline ({selectedPosts.size})
                </Button>
              </div>
            </div>

            {/* Posts List */}
            <div className="divide-y divide-gray-200">
              {pendingPosts.map((post) => {
                const categoryLabel = CATEGORIES.find(c => c.id === post.category)?.label || post.category;
                return (
                  <div key={post.id} className="p-6 flex gap-4 hover:bg-gray-50 transition-colors">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedPosts.has(post.id)}
                      onChange={() => handleSelectPost(post.id)}
                      className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />

                    {/* Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Post Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{post.title}</h3>
                            <span className={cn(
                              "px-2 py-0.5 text-xs font-semibold text-white rounded",
                              post.listingType === 'sell' ? 'bg-green-500' : 'bg-orange-500'
                            )}>
                              {post.listingType === 'sell' ? 'Sell' : 'Rent'}
                            </span>
                            <span className="px-2 py-0.5 bg-yellow-400 text-white text-xs font-medium rounded">
                              Pending Review
                            </span>
                          </div>
                          <p className="text-lg font-light text-green-500 mb-2">
                            {formatPrice(post.price)}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <p>Seller: <span className="font-medium">{post.sellerName}</span></p>
                            <p>Building: <span className="font-medium">{post.sellerBuilding}</span></p>
                            <p>Category: <span className="font-medium">{categoryLabel}</span></p>
                            <p>Posted: <span className="font-medium">{formatRelativeTime(post.postedAt)}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-start gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/posts/${post.id}`)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprovePost(post.id)}
                        className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDeclinePost(post.id)}
                        className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Decline
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {pendingPosts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No pending posts
              </div>
            )}
          </Card>
        )}

        {/* Manage Reports Tab */}
        {activeTab === 'reports' && (
          <Card className="border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <p className="text-gray-700">
                {pendingReports.length} pending reports awaiting review
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {pendingReports.map((report) => (
                <div key={report.id} className="p-6">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={report.itemImage}
                        alt={report.itemTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Report Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{report.itemTitle}</h3>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p>Reported by: <span className="font-medium text-gray-900">{report.reportedBy}</span></p>
                        <p>Reported user: <span className="font-medium text-gray-900">{report.reportedUser}</span></p>
                        <p>Reason: <span className="font-medium text-gray-900">{report.reason}</span></p>
                        <p>Reported: <span className="font-medium">{formatRelativeTime(report.reportedAt)}</span></p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/reports/${report.id}`)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleResolveReport(report.id)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDismissReport(report.id)}
                        className="border-red-300 text-red-500 hover:bg-red-50"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pendingReports.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No pending reports
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

