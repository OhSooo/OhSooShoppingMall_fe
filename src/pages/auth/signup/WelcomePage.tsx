import { useNavigate, useLocation } from 'react-router-dom';
import PageShell from '../../../components/common/PageShell';

export default function WelcomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 회원가입 성공 시 전달된 name 가져오기
  const name = (location.state as { name?: string })?.name || '';

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoLogin = () => {
    navigate('/login');
  };

  return (
    <PageShell>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '500px',
          margin: '0 auto',
          padding: '80px 0',
        }}
      >
        {/* 성공 아이콘 */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-point-main)',
            color: 'var(--color-white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '32px',
          }}
        >
          ✓
        </div>

        {/* 환영 메시지 */}
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'var(--color-black)',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          {name ? `${name}님, ` : ''}회원가입이 완료되었습니다!
        </h1>

        <p
          style={{
            fontSize: '16px',
            color: 'var(--color-gray-4)',
            marginBottom: '40px',
            textAlign: 'center',
            lineHeight: '1.6',
          }}
        >
          오수 쇼핑몰에 오신 것을 환영합니다.
          <br />
          이제 다양한 상품을 구매하고 즐기실 수 있습니다.
        </p>

        {/* 버튼들 */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
          }}
        >
          <button
            type="button"
            onClick={handleGoHome}
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--color-gray-4)',
              backgroundColor: 'var(--color-gray-0)',
              border: '1px solid var(--color-gray-2)',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-gray-1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-gray-0)';
            }}
          >
            홈으로
          </button>
          <button
            type="button"
            onClick={handleGoLogin}
            style={{
              flex: 1,
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--color-white)',
              backgroundColor: 'var(--color-point-main)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-point-main-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-point-main)';
            }}
          >
            로그인하기
          </button>
        </div>
      </div>
    </PageShell>
  );
}
