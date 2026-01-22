import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';
import { logout } from '../../services/auth/loginService';

export default function MyPage() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  return (
    <PageShell>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        {/* 페이지 타이틀 */}
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'var(--color-black)',
            marginBottom: '8px',
          }}
        >
          마이페이지
        </h1>

        {/* 메뉴 섹션 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* 내 정보 변경 카드 */}
          <Link
            to="/mypage/user"
            style={{
              display: 'block',
              padding: '24px',
              border: '2px solid var(--color-gray-2)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--color-black)',
              transition: 'all 0.2s',
              backgroundColor: 'var(--color-white)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-point-main)';
              e.currentTarget.style.backgroundColor = 'var(--color-point-back)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-gray-2)';
              e.currentTarget.style.backgroundColor = 'var(--color-white)';
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '4px',
                    color: 'var(--color-black)',
                  }}
                >
                  내 정보 변경
                </h2>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-gray-4)',
                    margin: 0,
                  }}
                >
                  이름, 생년월일, 성별, 전화번호, 주소를 변경할 수 있습니다.
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '24px', height: '24px', color: 'var(--color-gray-3)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          {/* 비밀번호 변경 카드 */}
          <Link
            to="/mypage/password"
            style={{
              display: 'block',
              padding: '24px',
              border: '2px solid var(--color-gray-2)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--color-black)',
              transition: 'all 0.2s',
              backgroundColor: 'var(--color-white)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-point-main)';
              e.currentTarget.style.backgroundColor = 'var(--color-point-back)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-gray-2)';
              e.currentTarget.style.backgroundColor = 'var(--color-white)';
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '4px',
                    color: 'var(--color-black)',
                  }}
                >
                  비밀번호 변경
                </h2>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-gray-4)',
                    margin: 0,
                  }}
                >
                  현재 비밀번호를 확인하고 새로운 비밀번호로 변경할 수 있습니다.
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '24px', height: '24px', color: 'var(--color-gray-3)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </div>

        {/* 로그아웃 버튼 */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid var(--color-gray-1)',
          }}
        >
          <button
            type="button"
            onClick={async () => {
              if (isLoggingOut) return;
              
              setIsLoggingOut(true);
              try {
                await logout();
                navigate('/', { replace: true });
              } catch (error) {
                console.error('로그아웃 실패:', error);
                alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
              } finally {
                setIsLoggingOut(false);
              }
            }}
            disabled={isLoggingOut}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--color-white)',
              backgroundColor: isLoggingOut ? 'var(--color-gray-3)' : 'var(--color-gray-4)',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (!isLoggingOut) {
                e.currentTarget.style.backgroundColor = 'var(--color-gray-5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoggingOut) {
                e.currentTarget.style.backgroundColor = 'var(--color-gray-4)';
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '18px', height: '18px' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
