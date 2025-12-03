import { ProductCard } from './ProductCard';
import type { Item } from '@/types';

interface ProductGridProps {
  items: Item[];
  emptyMessage?: string;
}

export function ProductGrid({ items, emptyMessage = 'No items found' }: ProductGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">📦</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map(item => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}

