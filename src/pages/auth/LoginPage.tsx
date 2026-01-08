import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';

type Role = 'USER' | 'STORE_OWNER' | 'ADMIN';

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState<Role>('USER');

  const redirect = useMemo(() => {
    const raw = params.get('redirect');
    if (!raw) return '/';
    try {
      // redirect는 AppRouter에서 encodeURIComponent로 넣으니까 decode
      const decoded = decodeURIComponent(raw);
      // 보안상 외부 URL 같은 건 막고 싶으면 여기서 체크 가능
      return decoded.startsWith('/') ? decoded : '/';
    } catch {
      return '/';
    }
  }, [params]);

  const handleLogin = () => {
    // 임시 로그인 처리 (나중에 API 호출 성공 시점에 이 부분만 유지하면 됨)
    localStorage.setItem('accessToken', 'test-token');
    localStorage.setItem('role', role);

    navigate(redirect, { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    navigate('/', { replace: true });
  };

  return (
    <PageShell title="LoginPage">
      <p>임시 로그인 페이지 (redirect 복귀 테스트용)</p>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="USER">USER</option>
            <option value="STORE_OWNER">STORE_OWNER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>

        <button type="button" onClick={handleLogin}>
          Login (set token/role + redirect)
        </button>

        <button type="button" onClick={handleLogout}>
          Logout (clear token/role)
        </button>
      </div>

      <p style={{ marginTop: 12 }}>
        redirect target: <code>{redirect}</code>
      </p>

      <ul>
        <li>로그인 안 된 상태에서 /cart 같은 보호 페이지로 가면 /login?redirect=... 로 올 거야</li>
        <li>여기서 Login 누르면 원래 페이지로 돌아감</li>
      </ul>
    </PageShell>
  );
}
