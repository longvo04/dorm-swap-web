import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, MessageSquare, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useItems } from '@/hooks/useItems';
import { formatPrice, formatRelativeTime } from '@/utils/formatters';
import { ROUTES, CATEGORIES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import type { ItemCondition, Item } from '@/types';

const conditionStyles: Record<ItemCondition, string> = {
  '100% New': 'border-teal-500 text-teal-600',
  'Like New': 'border-blue-500 text-blue-600',
  'Good': 'border-orange-500 text-orange-600',
  'Acceptable': 'border-red-500 text-red-600',
};

const REPORT_REASONS = ['Scam', 'Inappropriate', 'Spam', 'Other'] as const;

export function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItemById } = useItems();
  const [item, setItem] = useState<Item | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  useEffect(() => {
    if (!id) return;
    
    let isMounted = true;
    
    const fetchItem = async () => {
      setIsLoading(true);
      const fetchedItem = await getItemById(id);
      if (isMounted) {
        setItem(fetchedItem);
        setIsLoading(false);
      }
    };
    
    fetchItem();
    
    return () => {
      isMounted = false;
    };
  }, [id, getItemById]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h1>
        <Button onClick={() => navigate(ROUTES.HOME)}>Back to Home</Button>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  const categoryLabel = CATEGORIES.find(c => c.id === item.category)?.label || item.category;

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Back Link */}
      <div className="border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Listings</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Image Gallery */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-h-[calc(100vh-120px)] aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={item.images[currentImageIndex] || '/placeholder.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {item.images.length > 1 && (
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
            <div className="overflow-y-auto pr-2 space-y-4">
              {/* Title & Listing Type Badge */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {item.title}
                </h1>
                <span className={cn(
                  "px-3 py-1 text-xs font-semibold text-white rounded-lg flex-shrink-0",
                  item.listingType === 'sell' ? 'bg-green-500' : 'bg-orange-500'
                )}>
                  {item.listingType === 'sell' ? 'Sell' : 'Rent'}
                </span>
              </div>

              {/* Condition Badge */}
              <div>
                <span className={cn(
                  "inline-block px-3 py-1 text-sm font-medium rounded border bg-white",
                  conditionStyles[item.condition]
                )}>
                  {item.condition}
                </span>
              </div>
              
              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-light text-green-500">
                  {formatPrice(item.price)}
                </span>
                {item.listingType === 'rent' && (
                  <span className="text-gray-500 text-sm">/ {item.rentalPeriodDays} days</span>
                )}
              </div>

              {item.listingType === 'rent' && item.rentalDeposit && (
                <p className="text-gray-600 text-sm">
                  Deposit required: <span className="font-semibold">{formatPrice(item.rentalDeposit)}</span>
                </p>
              )}

              {/* Buy/Rent Now Button */}
              <Card className="border border-gray-200 p-3">
                <Button 
                  size="lg" 
                  onClick={() => navigate(`/items/${item.id}/payment`)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {item.listingType === 'sell' ? 'Buy Now' : 'Rent Now'}
                </Button>
              </Card>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Item Details Card */}
              <Card className="border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Item Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Category</span>
                    <span className="text-blue-600 font-medium text-sm">{categoryLabel}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-gray-500 text-sm">Posted</span>
                    <span className="text-blue-600 font-medium text-sm">{formatRelativeTime(item.createdAt)}</span>
                  </div>
                </div>
              </Card>

              {/* Report Item Button */}
              <Card className="border border-gray-200 p-3">
                <Button 
                  variant="outline"
                  size="lg" 
                  onClick={() => setIsReportModalOpen(true)}
                  className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Report Item
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setIsReportModalOpen(false);
              setReportReason('');
              setReportDescription('');
              setIsDropdownOpen(false);
            }}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Report Item</h2>
                  <p className="text-sm text-gray-500 mt-1">Help us understand what's wrong with this listing.</p>
                </div>
                <button 
                  onClick={() => {
                    setIsReportModalOpen(false);
                    setReportReason('');
                    setReportDescription('');
                    setIsDropdownOpen(false);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 space-y-4">
                {/* Reason Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors"
                    >
                      <span className={reportReason ? 'text-gray-900' : 'text-gray-400'}>
                        {reportReason || 'Select a reason'}
                      </span>
                      <ChevronDown className={cn(
                        "h-5 w-5 text-gray-400 transition-transform",
                        isDropdownOpen && "rotate-180"
                      )} />
                    </button>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        {REPORT_REASONS.map((reason) => (
                          <button
                            key={reason}
                            type="button"
                            onClick={() => {
                              setReportReason(reason);
                              setIsDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg",
                              reportReason === reason && "bg-gray-50"
                            )}
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* What happened? Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What happened?</label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Please describe the issue..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsReportModalOpen(false);
                    setReportReason('');
                    setReportDescription('');
                    setIsDropdownOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white disabled:bg-orange-300"
                  disabled={!reportReason}
                  onClick={() => {
                    // Handle report submission
                    console.log('Report submitted:', { reason: reportReason, description: reportDescription });
                    setIsReportModalOpen(false);
                    setReportReason('');
                    setReportDescription('');
                  }}
                >
                  Send Report
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

