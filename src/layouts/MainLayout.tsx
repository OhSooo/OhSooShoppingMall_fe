import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* header가 fixed라서 padding-top 필요 */}
      <main className="pt-header">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
