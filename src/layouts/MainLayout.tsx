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
        backgroundColor: 'var(--color-point-back)',
        color: 'var(--color-black)',
      }}
    >
      <Header />

      <main style={{ flex: 1, marginTop: '64px' }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
