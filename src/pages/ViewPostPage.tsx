import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { formatPrice, formatRelativeTime } from '@/utils/formatters';
import { ROUTES, CATEGORIES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import type { ItemCondition } from '@/types';

interface PostData {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  sellerName: string;
  sellerAvatar: string;
  sellerBuilding: string;
  sellerRating: number;
  sellerReviewCount: number;
  category: string;
  condition: ItemCondition;
  postedAt: Date;
  listingType: 'sell' | 'rent';
}

// Mock post data - in real app, this would come from API
const MOCK_POST_DATA: Record<string, PostData> = {
  'pending-1': {
    id: 'pending-1',
    title: 'Calculus Textbook (10th Edition)',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200',
    description: 'Gently used Calculus textbook, 10th edition. Perfect for students taking MATH 101 or MATH 102. All pages are intact with minimal highlighting. Includes access code (unused). Purchased last semester but switching majors, so no longer need it. Great condition overall!',
    sellerName: 'Emma Chen',
    sellerAvatar: 'https://i.pravatar.cc/150?img=5',
    sellerBuilding: 'A3',
    sellerRating: 4.8,
    sellerReviewCount: 24,
    category: 'textbooks',
    condition: 'Like New',
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    listingType: 'sell',
  },
  'pending-2': {
    id: 'pending-2',
    title: 'Desk Fan - Like New',
    price: 375000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
    description: 'Vintage-style desk fan in excellent condition. Barely used, works perfectly. Perfect for hot dorm rooms. Includes original box.',
    sellerName: 'Jake Thompson',
    sellerAvatar: 'https://i.pravatar.cc/150?img=12',
    sellerBuilding: 'B2',
    sellerRating: 4.6,
    sellerReviewCount: 15,
    category: 'electronics',
    condition: 'Like New',
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    listingType: 'sell',
  },
  'pending-3': {
    id: 'pending-3',
    title: 'Mini Fridge - Excellent Condition',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=200',
    description: 'Compact mini fridge perfect for dorm rooms. Excellent condition, all shelves included. Energy efficient and quiet operation.',
    sellerName: 'Michael Park',
    sellerAvatar: 'https://i.pravatar.cc/150?img=10',
    sellerBuilding: 'B1',
    sellerRating: 4.9,
    sellerReviewCount: 32,
    category: 'furniture',
    condition: '100% New',
    postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    listingType: 'sell',
  },
};

export function ViewPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [post, setPost] = useState<PostData | null>(null);

  useEffect(() => {
    if (id && MOCK_POST_DATA[id]) {
      setPost(MOCK_POST_DATA[id]);
    }
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link to={ROUTES.ADMIN} className="text-green-600 hover:underline">
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel = CATEGORIES.find(c => c.id === post.category)?.label || post.category;
  const images = [post.image]; // In real app, would have multiple images

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleApprove = () => {
    // In real app, would update post status to approved
    navigate(ROUTES.ADMIN);
  };

  const handleDecline = () => {
    // In real app, would update post status to declined
    navigate(ROUTES.ADMIN);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Link */}
      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to={ROUTES.ADMIN}
            className="inline-flex items-center gap-2 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Manage Posts</span>
          </Link>
          <span className={cn(
            "px-3 py-1 text-xs font-semibold text-white rounded",
            post.listingType === 'sell' ? 'bg-green-500' : 'bg-orange-500'
          )}>
            {post.listingType === 'sell' ? 'Sell' : 'Rent'}
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
                alt={post.title}
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
              <p className="text-2xl font-light text-green-500">{formatPrice(post.price)}</p>
            </div>

            {/* Seller Information */}
            <Card className="border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Seller Information</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={post.sellerName}
                    src={post.sellerAvatar}
                    size="md"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{post.sellerName}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{post.sellerRating}</span>
                      <span>({post.sellerReviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Building</p>
                  <p className="font-semibold text-gray-900">{post.sellerBuilding}</p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={handleApprove}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                Verify
              </Button>
              <Button
                size="lg"
                onClick={handleDecline}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                Dismiss
              </Button>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{post.description}</p>
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
                  <p className="font-medium text-gray-900">{post.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Posted</p>
                  <p className="font-medium text-gray-900">{formatRelativeTime(post.postedAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="inline-block px-2.5 py-0.5 bg-orange-400 text-white text-xs font-medium rounded">
                    Pending Review
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

