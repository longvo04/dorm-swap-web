import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { formatPrice, formatRelativeTime } from '@/utils/formatters';
import { ROUTES, CATEGORIES } from '@/utils/constants';
import type { ItemCondition } from '@/types';

interface ReportData {
  id: string;
  itemTitle: string;
  itemImage: string;
  itemPrice: number;
  itemCategory: string;
  itemCondition: ItemCondition;
  itemPostedAt: Date;
  reportedBy: string;
  reportedByAvatar: string;
  reportedUser: string;
  reportedUserAvatar: string;
  reportedUserBuilding: string;
  reportedUserRating: number;
  reportedUserReviewCount: number;
  reason: string;
  description: string;
  reportedAt: Date;
  status: 'pending' | 'resolved' | 'dismissed';
}

// Mock report data - in real app, this would come from API
const MOCK_REPORT_DATA: Record<string, ReportData> = {
  'report-1': {
    id: 'report-1',
    itemTitle: 'Calculus Textbook (10th Edition)',
    itemImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200',
    itemPrice: 850000,
    itemCategory: 'textbooks',
    itemCondition: 'Like New',
    itemPostedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    reportedBy: 'Alex Kim',
    reportedByAvatar: 'https://i.pravatar.cc/150?img=15',
    reportedUser: 'Emma Chen',
    reportedUserAvatar: 'https://i.pravatar.cc/150?img=5',
    reportedUserBuilding: 'A3',
    reportedUserRating: 4.8,
    reportedUserReviewCount: 24,
    reason: 'Not as described',
    description: 'The textbook condition was listed as "Like New" but many pages are missing and the cover is torn. The access code mentioned in the description was already used.',
    reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'pending',
  },
  'report-2': {
    id: 'report-2',
    itemTitle: 'Study Lamp (LED)',
    itemImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200',
    itemPrice: 500000,
    itemCategory: 'electronics',
    itemCondition: '100% New',
    itemPostedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    reportedBy: 'Sarah Johnson',
    reportedByAvatar: 'https://i.pravatar.cc/150?img=32',
    reportedUser: 'Alex Kim',
    reportedUserAvatar: 'https://i.pravatar.cc/150?img=15',
    reportedUserBuilding: 'A7',
    reportedUserRating: 4.5,
    reportedUserReviewCount: 18,
    reason: 'Item damaged',
    description: 'The lamp was returned with significant damage to the base. The LED functionality is compromised and the flexible neck is broken.',
    reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'pending',
  },
};

export function ViewReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [report, setReport] = useState<ReportData | null>(null);

  useEffect(() => {
    if (id && MOCK_REPORT_DATA[id]) {
      setReport(MOCK_REPORT_DATA[id]);
    }
  }, [id]);

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Report not found</h1>
          <Link to={ROUTES.ADMIN} className="text-green-600 hover:underline">
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel = CATEGORIES.find(c => c.id === report.itemCategory)?.label || report.itemCategory;
  const images = [report.itemImage]; // In real app, would have multiple images

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleVerify = () => {
    // In real app, would update report status to resolved
    navigate(ROUTES.ADMIN + '?tab=reports');
  };

  const handleDismiss = () => {
    // In real app, would update report status to dismissed
    navigate(ROUTES.ADMIN + '?tab=reports');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Link */}
      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to={ROUTES.ADMIN + '?tab=reports'}
            className="inline-flex items-center gap-2 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Manage Reports</span>
          </Link>
          <span className="px-3 py-1 text-xs font-semibold bg-black text-white rounded">
            {report.reportedUser === 'Emma Chen' ? 'Sell' : 'Rent'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={images[currentImageIndex]}
                alt={report.itemTitle}
                className="w-full h-full object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{report.itemTitle}</h1>
              <p className="text-2xl font-light text-green-500">{formatPrice(report.itemPrice)}</p>
            </div>

            {/* Seller Information */}
            <Card className="border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Seller Information</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={report.reportedUser}
                    src={report.reportedUserAvatar}
                    size="md"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{report.reportedUser}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{report.reportedUserRating}</span>
                      <span>({report.reportedUserReviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Building</p>
                  <p className="font-semibold text-gray-900">{report.reportedUserBuilding}</p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={handleVerify}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                Verify
              </Button>
              <Button
                size="lg"
                onClick={handleDismiss}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                Dismiss
              </Button>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{report.description}</p>
            </div>

            {/* Item Details */}
            <Card className="border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Item Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">{categoryLabel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Condition</p>
                  <p className="font-medium text-gray-900">{report.itemCondition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Posted</p>
                  <p className="font-medium text-gray-900">{formatRelativeTime(report.itemPostedAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="inline-block px-2.5 py-0.5 bg-orange-400 text-white text-xs font-medium rounded">
                    Pending Review
                  </span>
                </div>
              </div>
            </Card>

            {/* Report Details */}
            <Card className="border border-gray-200 p-4 bg-red-50">
              <h3 className="font-semibold text-gray-900 mb-3">Report Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-500">Reported by:</p>
                  <p className="font-medium text-gray-900">{report.reportedBy}</p>
                </div>
                <div>
                  <p className="text-gray-500">Reason:</p>
                  <p className="font-medium text-gray-900">{report.reason}</p>
                </div>
                <div>
                  <p className="text-gray-500">Reported:</p>
                  <p className="font-medium text-gray-900">{formatRelativeTime(report.reportedAt)}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

