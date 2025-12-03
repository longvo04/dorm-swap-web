import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Send } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { ROUTES } from '@/utils/constants';
import { cn } from '@/utils/cn';

interface Message {
  id: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  building: string;
  room: string;
  itemTitle: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Emma Chen',
    avatar: 'https://i.pravatar.cc/150?img=5',
    building: 'A3',
    room: '401',
    itemTitle: 'Calculus Textbook',
    lastMessage: 'Is it still available?',
    time: '5m ago',
    unread: true,
    messages: [
      { id: '1', text: 'Hi! Is this textbook still available?', time: '10:30 AM', isMe: false },
      { id: '2', text: 'Yes, it is! Are you interested?', time: '10:32 AM', isMe: true },
      { id: '3', text: 'Great! Can I see it this afternoon?', time: '10:35 AM', isMe: false },
      { id: '4', text: "Sure! I'm free after 3 PM. Where would you like to meet?", time: '10:36 AM', isMe: true },
      { id: '5', text: 'How about the library lobby?', time: '10:40 AM', isMe: false },
    ],
  },
  {
    id: '2',
    name: 'Jake Thompson',
    avatar: 'https://i.pravatar.cc/150?img=12',
    building: 'B2',
    room: '205',
    itemTitle: 'Desk Fan',
    lastMessage: 'Sure, I can meet tomorrow',
    time: '1h ago',
    unread: false,
    messages: [
      { id: '1', text: 'Hey, is the desk fan still for sale?', time: '9:00 AM', isMe: false },
      { id: '2', text: 'Yes it is! Would you like to come see it?', time: '9:15 AM', isMe: true },
      { id: '3', text: 'Sure, I can meet tomorrow', time: '9:20 AM', isMe: false },
    ],
  },
  {
    id: '3',
    name: 'Alex Rivera',
    avatar: 'https://i.pravatar.cc/150?img=8',
    building: 'C1',
    room: '302',
    itemTitle: 'Mountain Bike',
    lastMessage: "What's your best price?",
    time: '3h ago',
    unread: true,
    messages: [
      { id: '1', text: "I'm interested in the mountain bike", time: '7:00 AM', isMe: false },
      { id: '2', text: "What's your best price?", time: '7:05 AM', isMe: false },
    ],
  },
  {
    id: '4',
    name: 'Michael Tran',
    avatar: 'https://i.pravatar.cc/150?img=11',
    building: 'AG4',
    room: '102',
    itemTitle: 'Coffee Maker',
    lastMessage: 'When should I return it?',
    time: '2h ago',
    unread: false,
    messages: [
      { id: '1', text: 'Hi, I rented the coffee maker', time: '8:00 AM', isMe: false },
      { id: '2', text: 'When should I return it?', time: '8:05 AM', isMe: false },
    ],
  },
  {
    id: '5',
    name: 'Alex Kim',
    avatar: 'https://i.pravatar.cc/150?img=15',
    building: 'A7',
    room: '301',
    itemTitle: 'Study Lamp',
    lastMessage: 'There seems to be an issue',
    time: '1d ago',
    unread: false,
    messages: [
      { id: '1', text: 'Hi, about the study lamp...', time: 'Yesterday', isMe: false },
      { id: '2', text: 'There seems to be an issue', time: 'Yesterday', isMe: false },
    ],
  },
  {
    id: '6',
    name: 'Sofia Martinez',
    avatar: 'https://i.pravatar.cc/150?img=20',
    building: 'A11',
    room: '405',
    itemTitle: 'Desk Fan',
    lastMessage: 'Thanks for the purchase!',
    time: '3d ago',
    unread: false,
    messages: [
      { id: '1', text: 'Item received, thank you!', time: '3 days ago', isMe: false },
      { id: '2', text: 'Thanks for the purchase!', time: '3 days ago', isMe: true },
    ],
  },
];

export function ChatPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // Get initial conversation from URL param or default to first
  const getInitialConversation = (): Conversation | null => {
    const userName = searchParams.get('user');
    if (userName) {
      const found = MOCK_CONVERSATIONS.find(c => 
        c.name.toLowerCase().replace(/\s+/g, '-') === userName.toLowerCase() ||
        c.name.toLowerCase() === userName.toLowerCase().replace(/-/g, ' ')
      );
      if (found) return found;
    }
    return MOCK_CONVERSATIONS[0];
  };

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(getInitialConversation);

  // Update selected conversation when URL param changes
  useEffect(() => {
    const userName = searchParams.get('user');
    if (userName) {
      const found = MOCK_CONVERSATIONS.find(c => 
        c.name.toLowerCase().replace(/\s+/g, '-') === userName.toLowerCase() ||
        c.name.toLowerCase() === userName.toLowerCase().replace(/-/g, ' ')
      );
      if (found) {
        setSelectedConversation(found);
      }
    }
  }, [searchParams]);

  const filteredConversations = MOCK_CONVERSATIONS.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.itemTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    // In real app, would send message to backend
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Link */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 h-[calc(100vh-160px)]">
          {/* Conversations List */}
          <div className="w-96 bg-white rounded-xl border border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-green-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    "w-full flex items-start gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100",
                    selectedConversation?.id === conv.id && "bg-gray-50"
                  )}
                >
                  <Avatar name={conv.name} src={conv.avatar} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{conv.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{conv.time}</span>
                        {conv.unread && (
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Re: {conv.itemTitle}</p>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                  <Avatar name={selectedConversation.name} src={selectedConversation.avatar} size="md" />
                  <div>
                    <p className="font-semibold text-gray-900">{selectedConversation.name}</p>
                    <p className="text-sm text-gray-500">
                      Building {selectedConversation.building}, Room {selectedConversation.room}
                    </p>
                    <p className="text-sm text-gray-500">
                      Regarding: "{selectedConversation.itemTitle}"
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.isMe ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2.5",
                          msg.isMe
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        )}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={cn(
                          "text-xs mt-1",
                          msg.isMe ? "text-green-100" : "text-gray-500"
                        )}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <button
                      type="submit"
                      className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

