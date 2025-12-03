import { FiltersSidebar } from '@/components/filters/FiltersSidebar';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useItems } from '@/hooks/useItems';

export function HomePage() {
  const { filteredItems, filters, setFilters, isLoading } = useItems();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <FiltersSidebar
            filters={filters}
            onFiltersChange={setFilters}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Product Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
            </div>
          ) : (
            <ProductGrid items={filteredItems} />
          )}
        </main>
      </div>
    </div>
  );
}

