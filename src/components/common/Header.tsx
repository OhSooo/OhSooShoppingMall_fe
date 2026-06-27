import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const isLoggedIn = Boolean(localStorage.getItem('accessToken'));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = keyword.trim();
    navigate(q ? `/list/search?q=${encodeURIComponent(q)}` : '/list/search');
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        zIndex: 50,
        backgroundColor: 'var(--color-white)',
        borderBottom: '3px solid var(--color-point-main)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
      }}
    >
      {/* 좌측: 로고 - 고정 너비 */}
      <div style={{ width: '120px', flexShrink: 0 }}>
        <Link
          to="/"
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--color-point-main)',
            fontStyle: 'italic',
          }}
        >
          Mall
        </Link>
      </div>

      {/* 중앙: 검색창 - 고정 위치 유지 */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder=""
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              width: '320px',
              borderRadius: '9999px',
              border: '1px solid var(--color-point-main)',
              padding: '8px 40px 8px 16px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'var(--color-white)',
            }}
          />
          <button
            type="submit"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-point-main)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* 우측: 네비게이션 - 고정 너비 (좌측과 동일하게) */}
      <div style={{ width: '120px', flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px' }}>
          {isLoggedIn ? (
            <>
              <Link to="/chat" style={{ color: 'var(--color-point-main)', display: 'flex' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: '20px', height: '20px' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </Link>
              <Link to="/notifications" style={{ color: 'var(--color-point-main)', display: 'flex' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: '20px', height: '20px' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </Link>
              <Link to="/cart" style={{ color: 'var(--color-point-main)' }}>
                Cart
              </Link>
              <Link to="/mypage" style={{ color: 'var(--color-point-main)' }}>
                User
              </Link>
            </>
          ) : (
            <Link to="/login" style={{ color: 'var(--color-point-main)' }}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
