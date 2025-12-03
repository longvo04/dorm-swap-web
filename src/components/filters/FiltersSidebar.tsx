import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CATEGORIES, CONDITIONS, LISTING_TYPES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import type { ItemFilters, Category, ListingType, ItemCondition } from '@/types';

interface FiltersSidebarProps {
  filters: ItemFilters;
  onFiltersChange: (filters: ItemFilters) => void;
  className?: string;
}

export function FiltersSidebar({ filters, onFiltersChange, className }: FiltersSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryChange = (category: Category) => {
    const newCategory = filters.category === category ? undefined : category;
    onFiltersChange({ ...filters, category: newCategory });
  };

  const handleListingTypeChange = (listingType: ListingType | undefined) => {
    onFiltersChange({ ...filters, listingType });
  };

  const handleConditionChange = (condition: ItemCondition) => {
    const newCondition = filters.condition === condition ? undefined : condition;
    onFiltersChange({ ...filters, condition: newCondition });
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = value ? parseInt(value, 10) : undefined;
    onFiltersChange({ ...filters, [field]: numValue });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map(category => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={filters.category === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
              />
              <span>{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range (VND)</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">From</label>
            <input
              type="text"
              placeholder="0"
              value={filters.minPrice?.toLocaleString('vi-VN') || ''}
              onChange={(e) => handlePriceChange('minPrice', e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">To</label>
            <input
              type="text"
              placeholder="5.000.000"
              value={filters.maxPrice?.toLocaleString('vi-VN') || ''}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Listing Type */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Listing Type</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900">
            <span className={cn(
              "w-2 h-2 rounded-full",
              filters.listingType === undefined ? "bg-blue-500" : "bg-gray-300"
            )} />
            <input
              type="radio"
              name="listingType"
              checked={filters.listingType === undefined}
              onChange={() => handleListingTypeChange(undefined)}
              className="sr-only"
            />
            <span>All</span>
          </label>
          {LISTING_TYPES.map(type => (
            <label
              key={type.value}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900 ml-4"
            >
              <input
                type="radio"
                name="listingType"
                checked={filters.listingType === type.value}
                onChange={() => handleListingTypeChange(type.value)}
                className="sr-only"
              />
              <span>{type.value === 'sell' ? 'Sell' : 'Rent'}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Condition</h3>
        <div className="space-y-2">
          {CONDITIONS.map(condition => (
            <label
              key={condition.value}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={filters.condition === condition.value}
                onChange={() => handleConditionChange(condition.value)}
                className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
              />
              <span>{condition.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </Button>

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-80 bg-white z-50 lg:hidden overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <Card className={cn('hidden lg:block p-5', className)}>
        <FilterContent />
      </Card>
    </>
  );
}

