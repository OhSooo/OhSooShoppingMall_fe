import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

/**
 * MainLayout
 *
 * - 모든 메인 페이지에서 공통으로 쓰이는 레이아웃
 * - Header / Footer 고정
 * - 가운데 영역에 Outlet으로 페이지 렌더링
 *
 */

export default function MainLayout() {
  return (
    <div>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
