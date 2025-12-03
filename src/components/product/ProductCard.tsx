import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { formatPrice } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import type { Item, ItemCondition } from '@/types';

interface ProductCardProps {
  item: Item;
}

const conditionStyles: Record<ItemCondition, string> = {
  '100% New': 'border-teal-500 text-teal-600 bg-teal-50',
  'Like New': 'border-blue-500 text-blue-600 bg-blue-50',
  'Good': 'border-orange-500 text-orange-600 bg-orange-50',
  'Acceptable': 'border-red-500 text-red-600 bg-red-50',
};

export function ProductCard({ item }: ProductCardProps) {
  return (
    <Link to={`/items/${item.id}`}>
      <Card hover padding="none" className="group overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={item.images[0] || '/placeholder.jpg'}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Listing Type Badge - Top Right */}
          <div className="absolute top-3 right-3">
            <span className={cn(
              "px-3 py-1 text-xs font-semibold text-white rounded-2xl",
              item.listingType === 'sell' ? 'bg-green-500' : 'bg-orange-500'
            )}>
              {item.listingType === 'sell' ? 'Sell' : 'Rent'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-light text-sm text-gray-900 line-clamp-1 mb-2 group-hover:text-green-600 transition-colors">
            {item.title}
          </h3>
          
          {/* Condition Badge - Below Title */}
          <div className="mb-2">
            <span className={cn(
              "inline-block px-2.5 py-0.5 text-xs font-medium rounded border",
              conditionStyles[item.condition]
            )}>
              {item.condition}
            </span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-base font-light text-green-500">
              {formatPrice(item.price)}
            </span>
            {item.listingType === 'rent' && (
              <span className="text-sm text-gray-500">/ {item.rentalPeriodDays} days</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

