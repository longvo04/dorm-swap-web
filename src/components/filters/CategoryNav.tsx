import { cn } from '@/utils/cn';
import { CATEGORIES } from '@/utils/constants';
import type { Category } from '@/types';

interface CategoryNavProps {
  selectedCategory?: Category;
  onCategoryChange: (category?: Category) => void;
}

export function CategoryNav({ selectedCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onCategoryChange(undefined)}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
          !selectedCategory
            ? 'bg-primary-600 text-white shadow-sm'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        All
      </button>
      
      {CATEGORIES.map(category => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2',
            selectedCategory === category.id
              ? 'bg-primary-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          <span>{category.icon}</span>
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  );
}

