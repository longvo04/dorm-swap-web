import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, MessageSquare, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { useItems } from '@/hooks/useItems';
import { formatPrice, formatRelativeTime } from '@/utils/formatters';
import { ROUTES, CATEGORIES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import type { Item } from '@/types';
// Mock buyer data - in real app, this would come from the item/transaction
const MOCK_BUYER = {
  id: '2',
  name: 'Jake Thompson',
  avatar: 'https://i.pravatar.cc/150?img=12',
  rating: 4.9,
  reviewCount: 18,
  building: 'B2',
};

export function ViewMyItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItemById } = useItems();
  const [item, setItem] = useState<Item | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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

  // For demo: items with status 'pending' have no buyer yet
  const hasBuyer = item?.status === 'sold' || item?.status === 'rented';

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
        <Button onClick={() => navigate(ROUTES.PROFILE + '?tab=listings')}>Back to My Listings</Button>
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

  // Format price with rental unit
  const getPriceDisplay = () => {
    const price = formatPrice(item.price);
    if (item.listingType === 'rent') {
      if (item.rentalPeriodDays === 1) return `${price}/day`;
      if (item.rentalPeriodDays === 7) return `${price}/week`;
      if (item.rentalPeriodDays === 30) return `${price}/month`;
      return `${price}/${item.rentalPeriodDays} days`;
    }
    return price;
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Back Link */}
      <div className="border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            to={ROUTES.PROFILE + '?tab=listings'}
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
              
              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-light text-green-500">
                  {getPriceDisplay()}
                </span>
              </div>

              {/* Buyer Information or Awaiting Buyer */}
              {hasBuyer ? (
                <>
                  {/* Buyer Information Card */}
                  <Card className="border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Buyer Information</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={MOCK_BUYER.avatar}
                          name={MOCK_BUYER.name}
                          size="md"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{MOCK_BUYER.name}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{MOCK_BUYER.rating}</span>
                            <span>({MOCK_BUYER.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Building</p>
                        <p className="font-semibold text-gray-900">{MOCK_BUYER.building}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Chat with Buyer Button */}
                  <Card className="border border-gray-200 p-3">
                    <Button 
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        const formattedName = MOCK_BUYER.name.toLowerCase().replace(/\s+/g, '-');
                        navigate(`${ROUTES.CHAT}?user=${formattedName}`);
                      }}
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Chat with Buyer
                    </Button>
                  </Card>
                </>
              ) : (
                /* Awaiting Buyer Status */
                <Card className="border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-600">This item is active and awaiting a buyer</p>
                  </div>
                </Card>
              )}

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

