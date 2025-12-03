# DormSwap

A modern e-commerce platform for university dormitory residents to buy, sell, and rent items within their campus community.

## 📋 Overview

DormSwap is a full-featured marketplace application designed specifically for university students living in dormitories. The platform enables students to easily list, browse, and transact items such as textbooks, electronics, furniture, and more, all within their campus community.

## ✨ Features

### 🏠 Homepage
- Browse all available items with filtering options
- Search functionality
- Category-based filtering (Textbooks, Electronics, Household, Uniforms/Outfits, Sports, Other)
- Filter by listing type (Sell/Rent) and condition
- Price range filtering
- Responsive product grid with image carousel

### 👤 User Authentication
- Login page with secure authentication
- User session management
- Protected routes for authenticated users

### 📦 Item Management
- **Post New Item**: Create listings with multiple images, detailed descriptions, pricing, and categorization
- **Edit Item**: Update existing listings
- **View My Items**: See your own posted items with status (active/pending)
- **Item Details**: Full item information with image gallery, seller info, and transaction options

### 💬 Messaging System
- Real-time chat interface
- Conversation list with search
- Direct messaging with other users
- Chat navigation from transactions and listings

### 🔔 Notifications
- Notification dropdown in header
- All notifications page with filtering
- Notification types: Messages, Sales, Info alerts
- Time-based filtering (All time, Today, This week, This month)

### 💰 Transactions
- **Buying/Renting Tab**: Track purchases and rentals
  - Deposit payment tracking
  - Confirm item received
  - Report item not delivered (with refund)
- **Selling/Owning Tab**: Manage sales and rentals
  - Confirm item returned (for rentals)
  - Report damage/dispute
- **History Tab**: View completed and cancelled transactions
- Transaction status tracking (Awaiting Meetup, Renting, Dispute, Completed, Cancelled)

### 👥 Profile Management
- **My Profile**: View and edit personal information
  - Avatar upload
  - Dorm and room information
  - Statistics (Active Listings, Items Sold)
  - Recent activity feed
- **My Listings**: Manage posted items
  - Active and Pending tabs
  - View, Edit, Delete actions
  - Status badges
- **My Billing Information**:
  - Payment Method: Banking information management
  - Balances: View earnings, withdrawal functionality
  - Update banking details
  - Withdraw earnings with confirmation

### 🛡️ Admin Panel
- **Manage Posts**: Review and approve/decline pending listings
  - Bulk actions (Select All, Approve, Decline)
  - Individual post review
  - Detailed post view page
- **Manage Reports**: Handle user reports and disputes
  - View report details
  - Resolve or dismiss reports
  - Detailed report view page

### 💳 Payment System
- Secure payment page
- Item information display
- Cost breakdown
- Payment instructions
- QR code for scanning

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.10.0
- **Styling**: Tailwind CSS 4.1.17
- **Icons**: Lucide React
- **Utilities**: 
  - clsx & tailwind-merge for className management
  - PostCSS & Autoprefixer

## 📁 Project Structure

```
dormswap/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and other assets
│   ├── components/        # Reusable UI components
│   │   ├── filters/       # Filter components
│   │   ├── layout/        # Header, Footer
│   │   ├── product/       # Product-related components
│   │   └── ui/            # Base UI components (Button, Card, etc.)
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts     # Authentication logic
│   │   └── useItems.ts    # Item management logic
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ItemDetailsPage.tsx
│   │   ├── PostItemPage.tsx
│   │   ├── EditItemPage.tsx
│   │   ├── ViewMyItemPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ChatPage.tsx
│   │   ├── NotificationsPage.tsx
│   │   ├── PaymentPage.tsx
│   │   ├── AdminPage.tsx
│   │   ├── ViewPostPage.tsx
│   │   └── ViewReportPage.tsx
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   │   ├── constants.ts   # App constants and routes
│   │   ├── formatters.ts  # Data formatting utilities
│   │   ├── validators.ts  # Form validation
│   │   └── cn.ts          # className utility
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd dormswap
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Project

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

   The app will automatically reload when you make changes to the code.

### Building for Production

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Preview the production build**:
   ```bash
   npm run preview
   ```

### Other Commands

- **Lint the code**:
  ```bash
  npm run lint
  ```

## 🔐 Default User Credentials

For development purposes, the app uses mock authentication. You can log in with any credentials, and the app will create a mock session for testing.

**Mock User:**
- Name: Sarah Johnson
- Email: sarah.johnson@university.edu.vn
- Dorm: A3, Room 501

## 📱 Key Pages & Routes

- `/` - Homepage (Browse items)
- `/login` - Login page
- `/post` - Post new item
- `/items/:id` - Item details (public view)
- `/items/:id/edit` - Edit item
- `/my-items/:id` - View my own item
- `/items/:id/payment` - Payment page
- `/profile` - User profile
- `/profile?tab=listings` - My listings
- `/profile?tab=transactions` - My transactions
- `/profile?tab=billing` - Billing information
- `/chat` - Messages
- `/chat?user=username` - Chat with specific user
- `/notifications` - All notifications
- `/admin` - Admin management
- `/admin?tab=reports` - Manage reports
- `/admin/posts/:id` - View pending post
- `/admin/reports/:id` - View report details

## 🎨 Design Features

- Clean, modern UI with Tailwind CSS
- Responsive design for mobile and desktop
- Consistent color scheme (Green primary, Orange accents)
- Smooth transitions and hover effects
- Accessible components with proper ARIA labels

## 📝 Notes

- This is a frontend-only application with mock data
- All API calls are simulated with mock functions
- Authentication is handled client-side for development
- Images use placeholder services (pravatar.cc, unsplash.com, picsum.photos)

## 🤝 Contributing

This is an academic project for Electronic Commerce course. For questions or issues, please contact the development team.

## 📄 License

This project is created for educational purposes as part of the Electronic Commerce course assignment.
