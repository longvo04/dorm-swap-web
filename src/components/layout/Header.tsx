import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, MessageSquare, Bell, User, LogOut, Menu, X, DollarSign, Info, Settings } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { APP_NAME, ROUTES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import type { User as UserType } from '@/types';

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
  onSearch?: (query: string) => void;
}

// Mock messages for dropdown
const MOCK_MESSAGES = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=5',
    preview: 'Is the lamp still available?',
    unread: true,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: '',
    preview: 'Thanks! When can we meet?',
    unread: false,
  },
];

// Mock notifications for dropdown
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'message' as const,
    text: 'New message from Linh',
    time: '5m ago',
    unread: true,
  },
  {
    id: '2',
    type: 'sale' as const,
    text: 'Your item "Desk Fan" has been sold',
    time: '1h ago',
    unread: true,
  },
  {
    id: '3',
    type: 'message' as const,
    text: 'New message from Jake Thompson',
    time: '5h ago',
    unread: false,
  },
  {
    id: '4',
    type: 'info' as const,
    text: 'An user sent you a rent request.',
    time: '1d ago',
    unread: false,
  },
];

export function Header({ user, onLogout, onSearch }: HeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const closeAllDropdowns = () => {
    setIsProfileMenuOpen(false);
    setIsMessagesOpen(false);
    setIsNotificationsOpen(false);
  };

  const unreadNotifications = MOCK_NOTIFICATIONS.filter(n => n.unread).length;
  const unreadMessages = MOCK_MESSAGES.filter(m => m.unread).length;

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-1.5">
            <span className="text-2xl font-bold text-black-500">{APP_NAME}</span>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for textbooks, fans, bicycles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-green-500 outline-none transition-all text-gray-600 placeholder:text-gray-400"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Post Item Button */}
                <Button
                  size="sm"
                  onClick={() => navigate(ROUTES.POST_ITEM)}
                  className="hidden sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4"
                >
                  <Plus className="h-4 w-4" />
                  <span>Post New Item</span>
                </Button>

                {/* Messages Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsMessagesOpen(!isMessagesOpen);
                      setIsNotificationsOpen(false);
                      setIsProfileMenuOpen(false);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                  >
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadMessages}
                      </span>
                    )}
                  </button>

                  {isMessagesOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={closeAllDropdowns} />
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
                        <div className="p-4 border-b border-gray-100">
                          <h3 className="font-semibold text-gray-900">Messages</h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {MOCK_MESSAGES.map((msg) => (
                            <button
                              key={msg.id}
                              onClick={() => {
                                navigate(ROUTES.CHAT);
                                closeAllDropdowns();
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                            >
                              <Avatar name={msg.name} src={msg.avatar} size="sm" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm">{msg.name}</p>
                                <p className="text-sm text-gray-500 truncate">{msg.preview}</p>
                              </div>
                              {msg.unread && (
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                        <div className="p-3 border-t border-gray-100">
                          <button
                            onClick={() => {
                              navigate(ROUTES.CHAT);
                              closeAllDropdowns();
                            }}
                            className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            View all messages
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      setIsMessagesOpen(false);
                      setIsProfileMenuOpen(false);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={closeAllDropdowns} />
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                            Mark all as read
                          </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {MOCK_NOTIFICATIONS.map((notif) => (
                            <div
                              key={notif.id}
                              className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                notif.type === 'message' && "bg-green-50",
                                notif.type === 'sale' && "bg-orange-50",
                                notif.type === 'info' && "bg-blue-50"
                              )}>
                                {notif.type === 'message' && <MessageSquare className="h-4 w-4 text-green-600" />}
                                {notif.type === 'sale' && <DollarSign className="h-4 w-4 text-orange-600" />}
                                {notif.type === 'info' && <Info className="h-4 w-4 text-blue-600" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900">{notif.text}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{notif.time}</p>
                              </div>
                              {notif.unread && (
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="p-3 border-t border-gray-100">
                          <button
                            onClick={() => {
                              navigate('/notifications');
                              closeAllDropdowns();
                            }}
                            className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            View all notifications
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(!isProfileMenuOpen);
                      setIsMessagesOpen(false);
                      setIsNotificationsOpen(false);
                    }}
                    className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Avatar name={user.name} src={user.avatar} size="sm" />
                  </button>

                  {isProfileMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={closeAllDropdowns} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500 break-all">{user.email}</p>
                        </div>
                        <Link
                          to={ROUTES.PROFILE}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                          onClick={closeAllDropdowns}
                        >
                          <User className="h-4 w-4 text-gray-500" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to={ROUTES.PROFILE + '?tab=listings'}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                          onClick={closeAllDropdowns}
                        >
                          <Menu className="h-4 w-4 text-gray-500" />
                          <span>My Listings</span>
                        </Link>
                        <Link
                          to={ROUTES.ADMIN}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                          onClick={closeAllDropdowns}
                        >
                          <Settings className="h-4 w-4 text-gray-500" />
                          <span>Admin Manage</span>
                        </Link>
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            onLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <Button onClick={() => navigate(ROUTES.LOGIN)} className="bg-green-500 hover:bg-green-600">
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className={cn(
          'md:hidden pb-4 transition-all',
          isMobileMenuOpen ? 'block' : 'hidden'
        )}>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for textbooks, fans, bicycles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>
          </form>
          
          {user && (
            <Button
              size="sm"
              onClick={() => {
                navigate(ROUTES.POST_ITEM);
                setIsMobileMenuOpen(false);
              }}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600"
            >
              <Plus className="h-4 w-4" />
              <span>Post New Item</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
