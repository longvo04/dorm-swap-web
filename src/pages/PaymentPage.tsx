import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Shield, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useItems } from '@/hooks/useItems';
import { formatPrice } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';
import type { Item } from '@/types';

export function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItemById } = useItems();
  const [item, setItem] = useState<Item | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
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

  const handlePlaceOrder = () => {
    // Handle order placement
    console.log('Order placed for item:', item.id);
    alert('Order placed successfully! Check your transactions.');
    navigate(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Link */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={`/items/${item.id}`}
            className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Payment</h1>

        {/* How DormSwap Protects You */}
        <Card className="bg-amber-50 border-amber-200 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-orange-500">How DormSwap Protects You</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700">
                <span className="text-orange-500 font-medium">1. Secure Payment:</span>{' '}
                Your money is held safely in DormSwap's Escrow account, not sent directly to the seller.
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <span className="text-orange-500 font-medium">2. Meet & Verify:</span>{' '}
                After payment, chat is unlocked. Coordinate meetup and inspect the item in person.
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-700">
                <span className="text-orange-500 font-medium">3. Confirm & Release:</span>{' '}
                If satisfied, confirm in "My Transactions" and we'll release payment to the seller in 3-5 days.
              </p>
            </div>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Item Information */}
            <Card className="border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Information</h3>
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={item.images[0] || '/placeholder.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-xl font-light text-green-500 mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Cost Breakdown */}
            <Card className="border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-orange-500">Item Price</span>
                  <span className="text-gray-900">{formatPrice(item.price)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-light text-green-500">{formatPrice(item.price)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Payment Instructions */}
            <Card className="border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Instructions</h3>
              <p className="text-gray-600 mb-4">
                Please transfer <span className="text-green-500 font-semibold text-lg">{formatPrice(item.price)}</span> to the following account:
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-orange-500">Bank Name:</span>
                  <span className="font-medium text-gray-900">DormSwap Bank</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-500">Account Number:</span>
                  <span className="font-medium text-gray-900">1234-5678-9012</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-500">Account Name:</span>
                  <span className="font-medium text-green-600">DormSwap Platform</span>
                </div>
              </div>
            </Card>

            {/* Scan to Pay */}
            <Card className="border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Scan to Pay</h3>
              <div className="flex flex-col items-center">
                {/* QR Code Placeholder */}
                <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <ImageIcon className="w-16 h-16 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500">Scan this QR code with your banking app</p>
              </div>
            </Card>

            {/* Place Order Button */}
            <Button
              size="lg"
              onClick={handlePlaceOrder}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg"
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

