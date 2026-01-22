import { useNavigate } from 'react-router-dom';
import PageShell from '../../../components/common/PageShell';

export default function WelcomePage() {
  const navigate = useNavigate();

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
            backgroundColor: '#BF4134',
            color: '#FDFDFD',
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
            color: '#1B1B1B',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          회원가입이 완료되었습니다!
        </h1>

        <p
          style={{
            fontSize: '16px',
            color: '#626262',
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
              color: '#626262',
              backgroundColor: '#F5F5F5',
              border: '1px solid #CACACA',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EBEBEB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F5F5';
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
              color: '#FDFDFD',
              backgroundColor: '#BF4134',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#a63a2e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#BF4134';
            }}
          >
            로그인하기
          </button>
        </div>
      </div>
    </PageShell>
  );
}
