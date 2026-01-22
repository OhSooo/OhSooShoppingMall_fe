import { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';

// pages
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/signup/SignupPage';
import WelcomePage from '@/pages/auth/signup/WelcomePage';
import PasswordResetPage from '@/pages/auth/password/PasswordResetPage';
import PasswordResetedPage from '@/pages/auth/password/PasswordResetedPage';
import OAuthCallbackPage from '@/pages/auth/OAuthCallbackPage';
import OnboardingPage from '@/pages/auth/OnboardingPage';
import HomePage from '@/pages/home/HomePage';

import AllListPage from '@/pages/list/AllListPage';
import SearchListPage from '@/pages/list/SearchListPage';

import ItemPage from '@/pages/item/ItemPage';
import StorePage from '@/pages/store/StorePage';

import CartPage from '@/pages/buy/cart/CartPage';
import OrderPage from '@/pages/buy/order/OrderPage';

import PaymentPage from '@/pages/buy/payment/PaymentPage';
import PaymentSuccessPage from '@/pages/buy/payment/PaymentSuccessPage';
import PaymentFailPage from '@/pages/buy/payment/PaymentFailPage';

import ChatPage from '@/pages/chat/ChatPage';
import ChatRoomPage from '@/pages/chat/ChatRoomPage';

import MyPage from '@/pages/mypage/MyPage';
import MyInfoManagePage from '@/pages/mypage/user/MyInfoManagePage';
import MyOrderPage from '@/pages/mypage/order/MyOrderPage';
import MyReviewPage from '@/pages/mypage/review/MyReviewPage';
import PasswordChangePage from '@/pages/auth/password/PasswordChangePage';

import NotFoundPage from '@/pages/exception/NotFoundPage';
import ErrorPage from '@/pages/exception/ErrorPage';
import UnauthorizedPage from '@/pages/exception/UnauthorizedPage';

/**
 * ScrollToTop: 페이지 이동 시, 스크롤 맨 위로 고정
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function RootWrapper() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

/**
 * auth helpers (임시 localStorage 버전)
 * - 나중에 Redux selector로 교체
 */
type UserRole = 'GENERAL' | 'OWNER' | 'ADMIN';

function isLoggedIn(): boolean {
  return Boolean(localStorage.getItem('accessToken'));
}

function getRole(): UserRole | null {
  const role = localStorage.getItem('role');
  if (role === 'GENERAL' || role === 'OWNER' || role === 'ADMIN') return role;
  return null;
}

/**
 * 로그인 필요 가드 + redirect
 * - 로그인 안 되어있으면 /login?redirect=원래경로 로 이동
 */
function RequireAuth() {
  const location = useLocation();

  if (!isLoggedIn()) {
    const redirect = encodeURIComponent(location.pathname + location.search + location.hash);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <Outlet />;
}

/**
 * role 가드
 * - 로그인은 되어있는데 role이 맞지 않으면 /unauthorized 로 이동
 *
 * 사용 예:
 * { element: <RequireRole allowedRoles={["ADMIN"]} />, children: [...] }
 */
function RequireRole({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const location = useLocation();
  const role = getRole();

  // 로그인 자체가 안 되어있으면 auth 가드로 보내는 게 맞음
  if (!isLoggedIn()) {
    const redirect = encodeURIComponent(location.pathname + location.search + location.hash);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  // role이 없거나 허용되지 않은 경우
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

/**
 * Router
 */
const router = createBrowserRouter([
  {
    element: <RootWrapper />,
    errorElement: <ErrorPage />,
    children: [
      // ----------------------------
      // MainLayout 적용 (모든 페이지에 Header/Footer 적용)
      // ----------------------------
      {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
          // 홈
          { index: true, element: <HomePage /> },

          // 로그인 / 회원가입 / 권한 없음 페이지도 레이아웃 안에
          { path: 'login', element: <LoginPage /> },
          { path: 'signup', element: <SignupPage /> },
          { path: 'signup/welcome', element: <WelcomePage /> },
          { path: 'password-reset', element: <PasswordResetPage /> },
          { path: 'password-reset/success', element: <PasswordResetedPage /> },
          { path: 'oauth/callback', element: <OAuthCallbackPage /> },
          { path: 'unauthorized', element: <UnauthorizedPage /> },

          // 목록 / 검색
          { path: 'list', element: <AllListPage /> },
          { path: 'list/search', element: <SearchListPage /> },

          // 스토어 / 상품 상세 (비로그인도 가능)
          { path: 'store/:storeId', element: <StorePage /> },
          { path: 'item/:itemId', element: <ItemPage /> },

          // ----------------------------
          // 로그인 필요한 구간 (GENERAL/OWNER/ADMIN 모두 가능)
          // ----------------------------
          {
            element: <RequireAuth />,
            children: [
              // 온보딩 페이지 (소셜 로그인 첫 사용자용)
              { path: 'onboarding', element: <OnboardingPage /> },
              
              // 마이페이지
              { path: 'mypage', element: <MyPage /> },
              { path: 'mypage/user', element: <MyInfoManagePage /> },
              { path: 'mypage/password', element: <PasswordChangePage /> },
              { path: 'mypage/order', element: <MyOrderPage /> },
              { path: 'mypage/review', element: <MyReviewPage /> },

              // 장바구니
              { path: 'cart', element: <CartPage /> },

              // 주문/결제
              { path: 'order', element: <OrderPage /> },
              { path: 'payment', element: <PaymentPage /> },
              { path: 'payment/success', element: <PaymentSuccessPage /> },
              { path: 'payment/fail', element: <PaymentFailPage /> },

              // 채팅
              { path: 'chat', element: <ChatPage /> },
              { path: 'chat/:roomId', element: <ChatRoomPage /> },
            ],
          },

          // ----------------------------
          // 스토어 오너 전용 구간 (필요할 때 여기에 라우트 추가)
          // 예: "store/manage" 같은 페이지 생기면 여기 넣기
          // ----------------------------
          {
            element: <RequireRole allowedRoles={['OWNER']} />,
            children: [
              // TODO: 스토어 오너 전용 페이지 생기면 여기에 추가
              // { path: "owner/dashboard", element: <OwnerDashboardPage /> },
            ],
          },

          // ----------------------------
          // 운영자(ADMIN) 전용 구간 (필요할 때 여기에 라우트 추가)
          // ----------------------------
          {
            element: <RequireRole allowedRoles={['ADMIN']} />,
            children: [
              // TODO: 운영자 전용 페이지 생기면 여기에 추가
              // { path: "admin", element: <AdminPage /> },
            ],
          },

          // 404 (MainLayout 안)
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
