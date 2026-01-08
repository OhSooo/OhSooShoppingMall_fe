import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';

export default function UnauthorizedPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <PageShell title="UnauthorizedPage (401/403)">
      <p>로그인은 되어있지만, 접근 권한(role)이 없어서 막힌 페이지입니다.</p>
      <p>
        요청 경로: <code>{location.pathname}</code>
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => navigate(-1)}>
          이전으로
        </button>
        <Link to="/">홈으로</Link>
        <Link to="/login">로그인 페이지</Link>
      </div>
    </PageShell>
  );
}
