import { Link, useLocation } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <PageShell>
      <p>존재하지 않는 경로입니다.</p>
      <p>
        요청 경로: <code>{location.pathname}</code>
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        <Link to="/">홈으로</Link>
        <Link to="/list">목록으로</Link>
      </div>
    </PageShell>
  );
}
