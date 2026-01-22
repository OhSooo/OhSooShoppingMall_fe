import { useLocation, useNavigate } from 'react-router-dom';
import PageShell from '../../../components/common/PageShell';

export default function PasswordResetedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || '';

  return (
    <PageShell>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '400px',
          margin: '0 auto',
          padding: '40px 0 80px 0',
        }}
      >
        {/* 성공 아이콘 */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#BF4134',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              fontSize: '40px',
              color: '#FDFDFD',
              fontWeight: '700',
            }}
          >
            ✓
          </span>
        </div>

        {/* 타이틀 */}
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1B1B1B',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          임시 비밀번호 발급 완료
        </h1>

        {/* 설명 텍스트 */}
        <p
          style={{
            fontSize: '15px',
            color: '#626262',
            textAlign: 'center',
            marginBottom: '40px',
            lineHeight: '1.6',
          }}
        >
          {email ? (
            <>
              <strong style={{ color: '#1B1B1B' }}>{email}</strong>로
              <br />
              임시 비밀번호를 전송했습니다.
            </>
          ) : (
            <>
              입력하신 이메일로
              <br />
              임시 비밀번호를 전송했습니다.
            </>
          )}
        </p>

        {/* 안내 메시지 */}
        <div
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#F5F5F5',
            borderRadius: '6px',
            marginBottom: '40px',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              color: '#626262',
              lineHeight: '1.6',
              margin: 0,
              textAlign: 'center',
            }}
          >
            이메일을 확인하시고
            <br />
            임시 비밀번호로 로그인해주세요.
          </p>
        </div>

        {/* 로그인 페이지로 이동 버튼 */}
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{
            width: '100%',
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
          로그인 페이지로 이동
        </button>
      </div>
    </PageShell>
  );
}
