import { Link } from 'react-router-dom';
import PageShell from '../../components/common/PageShell';

export default function MyPage() {
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
      </div>
    </PageShell>
  );
}
