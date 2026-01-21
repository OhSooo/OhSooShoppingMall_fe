import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type Props = {
  title: string;
  children?: ReactNode;
};

export default function PageShell({ title, children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* ===== 페이지 타이틀 ===== */}
      <h1 className="text-2xl font-semibold">{title}</h1>

      {/* ===== 라우팅 테스트용 이동 버튼들 ===== */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Back
        </button>

        <Link
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          to="/"
        >
          Home
        </Link>
        <Link
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          to="/list"
        >
          List
        </Link>
        <Link
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          to="/list/search?q=test"
        >
          Search(test)
        </Link>
        <Link
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          to="/store/1"
        >
          Store(1)
        </Link>
        <Link
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          to="/item/1"
        >
          Item(1)
        </Link>
        <Link
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          to="/cart"
        >
          Cart
        </Link>
        <Link
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          to="/mypage/user"
        >
          MyPage
        </Link>
        <Link
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          to="/chat"
        >
          Chat
        </Link>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* ===== 실제 페이지 내용 ===== */}
      <div>{children}</div>

      {/* ===== 우측 하단 Debug HUD (fixed) ===== */}
      <div className="fixed bottom-4 right-4 z-[60]">
        <div className="rounded-lg border border-gray-200 bg-white/80 p-3 text-xs shadow-md backdrop-blur">
          <div className="space-y-1">
            <div>
              <strong>Path:</strong>{' '}
              <code className="rounded bg-gray-100 px-2 py-0.5">{location.pathname}</code>
            </div>
            <div>
              <strong>Token:</strong>{' '}
              <code className="rounded bg-gray-100 px-2 py-0.5">{token ? 'EXISTS' : 'NONE'}</code>
            </div>
            <div>
              <strong>Role:</strong>{' '}
              <code className="rounded bg-gray-100 px-2 py-0.5">{role || 'NONE'}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
