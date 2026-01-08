import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Header
 * - 로고 + 검색창 + 우측 메뉴
 * - 로그인 X: Login만
 * - 로그인 O: Chat / Cart / User
 * - 검색 시 /list/search?q=검색어 로 이동
 *
 */

export default function Header() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  // TODO: Redux authSlice 붙이면 selector로 교체
  const isLoggedIn = Boolean(localStorage.getItem('accessToken'));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const q = keyword.trim();
    if (!q) {
      navigate('/list/search');
      return;
    }
    navigate(`/list/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header>
      <div>
        {/* 로고 */}
        <Link to="/">Mall</Link>

        {/* 검색 */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">검색</button>
        </form>

        {/* 우측 메뉴 */}
        <nav>
          {isLoggedIn ? (
            <>
              <Link to="/chat">Chat</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/mypage">User</Link>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
