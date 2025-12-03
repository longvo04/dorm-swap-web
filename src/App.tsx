import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { ItemDetailsPage } from '@/pages/ItemDetailsPage';
import { PaymentPage } from '@/pages/PaymentPage';
import { PostItemPage } from '@/pages/PostItemPage';
import { EditItemPage } from '@/pages/EditItemPage';
import { ViewMyItemPage } from '@/pages/ViewMyItemPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { EditProfilePage } from '@/pages/EditProfilePage';
import { ChatPage } from '@/pages/ChatPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { AdminPage } from '@/pages/AdminPage';
import { ViewPostPage } from '@/pages/ViewPostPage';
import { ViewReportPage } from '@/pages/ViewReportPage';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';

function AppContent() {
  const { user, isAuthenticated, isLoading, login, logout, updateUser } = useAuth();
  const location = useLocation();
  
  // Hide header/footer on certain pages
  const isAuthPage = location.pathname === ROUTES.LOGIN;
  const isItemDetailsPage = location.pathname.startsWith('/items/');
  const isMyItemPage = location.pathname.startsWith('/my-items/');
  const isProfilePage = location.pathname.startsWith('/profile');
  const isChatPage = location.pathname === ROUTES.CHAT;
  const isNotificationsPage = location.pathname === ROUTES.NOTIFICATIONS;
  const isAdminPage = location.pathname === ROUTES.ADMIN || location.pathname.startsWith('/admin/');
  const hideLayout = isAuthPage || isItemDetailsPage || isMyItemPage || isProfilePage || isChatPage || isNotificationsPage || isAdminPage;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  // Full-screen layout for auth pages, item details, profile, chat, notifications, and admin
  if (hideLayout && (!isAuthenticated || isItemDetailsPage || isMyItemPage || isProfilePage || isChatPage || isNotificationsPage || isAdminPage)) {
    return (
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage onLogin={login} />} />
        <Route path={ROUTES.ITEM_DETAILS} element={<ItemDetailsPage />} />
        <Route path={ROUTES.PAYMENT} element={<PaymentPage />} />
        <Route 
          path={ROUTES.EDIT_ITEM} 
          element={
            isAuthenticated ? (
              <EditItemPage />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          } 
        />
        <Route 
          path={ROUTES.VIEW_MY_ITEM} 
          element={
            isAuthenticated ? (
              <ViewMyItemPage />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          } 
        />
        <Route 
          path={ROUTES.CHAT} 
          element={
            isAuthenticated ? (
              <ChatPage />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          } 
        />
        <Route 
          path={ROUTES.NOTIFICATIONS} 
          element={
            isAuthenticated ? (
              <NotificationsPage />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          } 
        />
        <Route 
          path={ROUTES.ADMIN} 
          element={
            isAuthenticated ? (
              <AdminPage />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          } 
        />
        <Route 
          path={ROUTES.VIEW_POST} 
          element={
            isAuthenticated ? (
              <ViewPostPage />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          } 
        />
        <Route 
          path={ROUTES.VIEW_REPORT} 
          element={
            isAuthenticated ? (
              <ViewReportPage />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          } 
        />
        <Route 
          path={ROUTES.PROFILE} 
          element={
            isAuthenticated && user ? (
              <ProfilePage user={user} onUpdateUser={updateUser} onLogout={logout} />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          } 
        />
        <Route 
          path={ROUTES.EDIT_PROFILE} 
          element={
            isAuthenticated && user ? (
              <EditProfilePage user={user} onUpdateUser={updateUser} />
            ) : (
              <Navigate to={ROUTES.LOGIN} replace />
            )
          } 
        />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header user={user} onLogout={logout} />
      
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.ITEM_DETAILS} element={<ItemDetailsPage />} />
          
          {/* Auth Routes */}
          <Route
            path={ROUTES.LOGIN}
            element={<Navigate to={ROUTES.HOME} replace />}
          />

          {/* Protected Routes */}
          <Route
            path={ROUTES.POST_ITEM}
            element={
              isAuthenticated ? (
                <PostItemPage />
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />
          
          <Route
            path={ROUTES.MY_LISTINGS}
            element={<Navigate to={ROUTES.PROFILE + '?tab=listings'} replace />}
          />

          <Route
            path={ROUTES.EDIT_ITEM}
            element={
              isAuthenticated ? (
                <EditItemPage />
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />

          <Route
            path={ROUTES.VIEW_MY_ITEM}
            element={
              isAuthenticated ? (
                <ViewMyItemPage />
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />
          
          <Route
            path={ROUTES.PROFILE}
            element={
              isAuthenticated && user ? (
                <ProfilePage user={user} onUpdateUser={updateUser} onLogout={logout} />
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />
          
          <Route
            path={ROUTES.EDIT_PROFILE}
            element={
              isAuthenticated && user ? (
                <EditProfilePage user={user} onUpdateUser={updateUser} />
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />

          <Route
            path={ROUTES.CHAT}
            element={
              isAuthenticated ? (
                <ChatPage />
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />

          <Route
            path={ROUTES.NOTIFICATIONS}
            element={
              isAuthenticated ? (
                <NotificationsPage />
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />

          <Route
            path={ROUTES.ADMIN}
            element={
              isAuthenticated ? (
                <AdminPage />
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
