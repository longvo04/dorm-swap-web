import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, MessageSquare, DollarSign, Info, ChevronDown } from 'lucide-react';
import { ROUTES } from '@/utils/constants';
import { cn } from '@/utils/cn';

type NotificationType = 'message' | 'sale' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  text: string;
  time: string;
  unread: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'message',
    text: 'New message from Linh',
    time: '5m ago',
    unread: true,
  },
  {
    id: '2',
    type: 'sale',
    text: 'Your item "Desk Fan" has been sold',
    time: '1h ago',
    unread: true,
  },
  {
    id: '3',
    type: 'message',
    text: 'New message from Jake Thompson',
    time: '5h ago',
    unread: false,
  },
  {
    id: '4',
    type: 'info',
    text: 'An user sent you a rent request.',
    time: '1d ago',
    unread: false,
  },
  {
    id: '5',
    type: 'sale',
    text: 'Your item "Bicycle" has been sold',
    time: '2d ago',
    unread: false,
  },
  {
    id: '6',
    type: 'message',
    text: 'New message from Alex Kim',
    time: '3d ago',
    unread: false,
  },
  {
    id: '7',
    type: 'info',
    text: 'Price drop alert: Calculus Textbook now đ625,000',
    time: '5d ago',
    unread: false,
  },
  {
    id: '8',
    type: 'sale',
    text: 'Your item "Coffee Maker" has been sold',
    time: '1w ago',
    unread: false,
  },
];

const TIME_FILTERS = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
];

export function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [isTimeFilterOpen, setIsTimeFilterOpen] = useState(false);

  const filteredNotifications = MOCK_NOTIFICATIONS.filter(notif =>
    notif.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTimeFilter = TIME_FILTERS.find(f => f.value === timeFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-6">
            <Link
              to={ROUTES.HOME}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-green-500 outline-none text-sm"
              />
            </div>

            {/* Time Filter */}
            <div className="relative">
              <button
                onClick={() => setIsTimeFilterOpen(!isTimeFilterOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {selectedTimeFilter?.label}
                <ChevronDown className={cn("h-4 w-4 transition-transform", isTimeFilterOpen && "rotate-180")} />
              </button>

              {isTimeFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsTimeFilterOpen(false)} />
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                    {TIME_FILTERS.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => {
                          setTimeFilter(filter.value);
                          setIsTimeFilterOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors",
                          timeFilter === filter.value && "text-green-600 bg-green-50"
                        )}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Notifications</h1>
          <p className="text-gray-500 mt-1">{filteredNotifications.length} notifications</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif, index) => (
              <div
                key={notif.id}
                className={cn(
                  "flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer",
                  index !== filteredNotifications.length - 1 && "border-b border-gray-100"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  notif.type === 'message' && "bg-green-50",
                  notif.type === 'sale' && "bg-orange-50",
                  notif.type === 'info' && "bg-blue-50"
                )}>
                  {notif.type === 'message' && <MessageSquare className="h-5 w-5 text-green-600" />}
                  {notif.type === 'sale' && <DollarSign className="h-5 w-5 text-orange-600" />}
                  {notif.type === 'info' && <Info className="h-5 w-5 text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900">{notif.text}</p>
                  <p className="text-sm text-gray-500 mt-1">{notif.time}</p>
                </div>
                {notif.unread && (
                  <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-1.5" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              No notifications found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

