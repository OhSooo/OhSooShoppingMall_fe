import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../../components/common/PageShell';

export default function PasswordResetPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('이메일을 입력해주세요.');
      return;
    }

    // 간단한 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // TODO: 실제 API 호출
      // const response = await passwordResetApi({ email });
      // if (response.success) {
      //   navigate('/password-reset/success', { state: { email } });
      // }

      // 임시 처리: 성공 페이지로 이동
      setTimeout(() => {
        navigate('/password-reset/success', { state: { email } });
      }, 500);
    } catch (error) {
      setErrorMessage('임시 비밀번호 발급에 실패했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

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
        {/* 타이틀 */}
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1B1B1B',
            marginBottom: '40px',
            textAlign: 'center',
          }}
        >
          비밀번호 재발급
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
          가입하신 이메일 주소를 입력해주세요.
          <br />
          임시 비밀번호를 이메일로 발송해드립니다.
        </p>

        {/* 이메일 입력 폼 */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* 이메일 입력 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="email"
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#444444',
              }}
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage('');
              }}
              placeholder="example@email.com"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: errorMessage
                  ? '1px solid #BF4134'
                  : '1px solid #CACACA',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: isLoading ? '#F5F5F5' : '#FDFDFD',
              }}
              onFocus={(e) => {
                if (!errorMessage) e.target.style.borderColor = '#BF4134';
              }}
              onBlur={(e) => {
                if (!errorMessage) e.target.style.borderColor = '#CACACA';
              }}
            />
            {/* 에러 메시지 영역 */}
            {errorMessage && (
              <div
                style={{
                  fontSize: '13px',
                  color: '#BF4134',
                  minHeight: '18px',
                }}
              >
                {errorMessage}
              </div>
            )}
            {!errorMessage && <div style={{ minHeight: '18px' }}></div>}
          </div>

          {/* 전송 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#FDFDFD',
              backgroundColor: isLoading ? '#9D9D9D' : '#BF4134',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginTop: '8px',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#a63a2e';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#BF4134';
            }}
          >
            {isLoading ? '전송 중...' : '임시 비밀번호 발급'}
          </button>
        </form>

        {/* 로그인 페이지로 돌아가기 */}
        <div
          style={{
            marginTop: '24px',
            fontSize: '14px',
            color: '#626262',
          }}
        >
          <span
            onClick={() => navigate('/login')}
            style={{
              color: '#BF4134',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#a63a2e')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#BF4134')}
          >
            로그인 페이지로 돌아가기
          </span>
        </div>
      </div>
    </PageShell>
  );
}
