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
    <header className="fixed top-0 left-0 right-0 z-50 h-header border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="text-lg font-semibold text-black">
          Mall
        </Link>

        <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-2">
          <input
            type="text"
            placeholder="Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-point-main"
          />
          <button
            type="submit"
            className="shrink-0 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-point-back"
          >
            검색
          </button>
        </form>

        <nav className="flex items-center gap-3 text-sm">
          {isLoggedIn ? (
            <>
              <Link to="/chat" className="hover:text-point-main">
                Chat
              </Link>
              <Link to="/cart" className="hover:text-point-main">
                Cart
              </Link>
              <Link to="/mypage" className="hover:text-point-main">
                User
              </Link>
            </>
          ) : (
            <Link to="/login" className="hover:text-point-main">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
