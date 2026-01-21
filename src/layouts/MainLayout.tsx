import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function MainLayout() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#E6E5E3',
        color: '#1B1B1B',
      }}
    >
      <Header />

      {/* header가 fixed라서 margin-top으로 밀어줌 */}
      <main style={{ flex: 1, marginTop: '64px' }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
