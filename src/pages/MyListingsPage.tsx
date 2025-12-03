import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useItems } from '@/hooks/useItems';
import { formatPrice, formatRelativeTime } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';
import type { Item } from '@/types';

interface MyListingsPageProps {
  userId: string;
}

export function MyListingsPage({ userId }: MyListingsPageProps) {
  const navigate = useNavigate();
  const { items, deleteItem } = useItems();
  
  // Filter to only show current user's items
  const myItems = items.filter(item => item.sellerId === userId && item.status !== 'removed');

  const handleDelete = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      await deleteItem(itemId);
    }
  };

  const getStatusBadge = (item: Item) => {
    switch (item.status) {
      case 'available':
        return <Badge variant="success">Active</Badge>;
      case 'sold':
        return <Badge variant="default">Sold</Badge>;
      case 'rented':
        return <Badge variant="warning">Rented</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-500 mt-1">Manage your posted items</p>
        </div>
        <Button onClick={() => navigate(ROUTES.POST_ITEM)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Post New Item
        </Button>
      </div>

      {/* Listings */}
      {myItems.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-500 mb-6">Start selling or renting your items today!</p>
          <Button onClick={() => navigate(ROUTES.POST_ITEM)}>
            Post Your First Item
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {myItems.map(item => (
            <Card key={item.id} hover className="flex gap-4">
              {/* Image */}
              <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={item.images[0] || '/placeholder.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(item)}
                      <Badge variant={item.listingType === 'sell' ? 'primary' : 'success'} size="sm">
                        {item.listingType === 'sell' ? 'Sale' : 'Rent'}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                    <p className="text-lg font-bold text-primary-600 mt-1">
                      {formatPrice(item.price)}
                      {item.listingType === 'rent' && (
                        <span className="text-sm font-normal text-gray-500"> / {item.rentalPeriodDays} days</span>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/items/${item.id}`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="h-5 w-5 text-gray-500" />
                    </Link>
                    <Link
                      to={`/items/${item.id}/edit`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-5 w-5 text-gray-500" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Posted {formatRelativeTime(item.createdAt)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

